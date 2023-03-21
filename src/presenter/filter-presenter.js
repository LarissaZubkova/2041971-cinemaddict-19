import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import ProfileView from '../view/profile-view.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../consts.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;
  #profileComponent = null;
  #profileContainer = null;

  constructor({filterContainer, filterModel, filmsModel, profileContainer}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#profileContainer = profileContainer;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: FilterType.ALL,
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init() {
    const filters = this.filters;

    const prevFilterComponent = this.#filterComponent;
    const prevProfileComponent = this.#profileComponent;

    const watchedFilms = filters.find((film)=>film.type === FilterType.HISTORY).count;

    this.#profileComponent = new ProfileView({watchedFilms});

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#profileContainer);
    } else {
      replace(this.#profileComponent, prevProfileComponent);
      remove(prevProfileComponent);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
