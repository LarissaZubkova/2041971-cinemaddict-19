import {render, remove, RenderPosition} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import {FILM_COUNT_PER_STEP, Titles, SortType, UpdateType, UserAction, FilterType} from '../consts.js';
import {isExtra, getTopRatedFilms, getMostCommentedFilms, sortByDate, sortByRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import FilmPrsenter from './film-presener.js';

export default class BoardPresenter {
  #boardContainer = null;
  #bodyElement = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #filmsListComponent = new FilmsListView();
  #loadingComponent = new LoadingView();
  #sectionTopRatedComponent = new FilmsListView(isExtra, Titles.TOP_RATED);
  #sectionMostCommentedComponent = new FilmsListView(isExtra, Titles.MOST_COMMENTED);
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #noFilmComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsPresenter = new Map();
  #filmsTopRatedPresenter = new Map();
  #filmsMostCommentedPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor({boardContainer, bodyElement, filmsModel, commentsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#bodyElement = bodyElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init() {
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    const filmCount = this.films.length;

    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if(this.#renderedFilmCount >= filmCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.resetView());
    this.#filmsTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmsMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    console.log(update)
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsPresenter.get(update.id).setSaving();
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#filmsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsPresenter.get(update.film.id).setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.#filmsPresenter.get(update.film.id).setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsPresenter.get(update.film.id).setDeleting();
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#filmsPresenter.get(update.film.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(data)
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmsPresenter.get(data.id)) {
          this.#filmsPresenter.get(data.id).init(data, this.#commentsModel);
        }
        if (this.#filmsTopRatedPresenter.get(data.id)){
          this.#filmsTopRatedPresenter.get(data.id).init(data, this.#commentsModel);
        }
        if (this.#filmsMostCommentedPresenter.get(data.id)){
          this.#filmsMostCommentedPresenter.get(data.id).init(data, this.#commentsModel);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        console.log(data, this.#commentsModel)
        this.#filmsPresenter.get(data.id).init(data, this.#commentsModel);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }

  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPrsenter({
      filmListContainer: this.#filmsListComponent.element.querySelector('.films-list__container'),
      filterType: this.#filterType,
      bodyElement: this.#bodyElement,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    filmPresenter.init(film, this.#commentsModel);
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderTopRatedFilm(film) {
    const topRatedPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionTopRatedComponent.element.querySelector('.films-list__container'),
      bodyElement: this.#bodyElement,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    topRatedPresenter.init(film, this.#commentsModel);
    this.#filmsTopRatedPresenter.set(film.id, topRatedPresenter);
  }

  #renderMostCommentedFilm(film) {
    const mostCommentedPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionMostCommentedComponent.element.querySelector('.films-list__container'),
      bodyElement: this.#bodyElement,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    mostCommentedPresenter.init(film, this.#commentsModel);
    this.#filmsMostCommentedPresenter.set(film.id, mostCommentedPresenter);
  }

  #renderFilms(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderTopRatedFilms() {
    const topRatedFilms = getTopRatedFilms(this.films);
    topRatedFilms.forEach((film) => this.#renderTopRatedFilm(film));
  }

  #renderMostCommentedFilms() {
    const mostCommentedFilms = getMostCommentedFilms(this.films);
    mostCommentedFilms.forEach((film) => this.#renderMostCommentedFilm(film));
  }

  #renderLoading() {
    remove(this.#filmsListComponent);
    remove(this.#sectionTopRatedComponent);
    remove(this.#sectionMostCommentedComponent);

    render(this.#loadingComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms() {
    remove(this.#filmsListComponent);
    remove(this.#sectionTopRatedComponent);
    remove(this.#sectionMostCommentedComponent);

    this.#noFilmComponent = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#noFilmComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick,
    });

    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  }

  #clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this.films.length;

    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#filmsTopRatedPresenter.clear();
    this.#filmsMostCommentedPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#boardComponent.element);
    render(this.#sectionTopRatedComponent, this.#boardComponent.element);
    render(this.#sectionMostCommentedComponent, this.#boardComponent.element);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }

    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  }
}
