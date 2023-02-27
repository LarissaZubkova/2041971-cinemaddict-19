import {render, remove, RenderPosition} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SectionView from '../view/section-view.js';
import SortView from '../view/sort-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {FILM_COUNT_PER_STEP, Titles} from '../const.js';
import {isExtra, getTopRatedFilms, getMostCommentedFilms} from '../utils/film.js';
import FilmPrsenter from './film-presener.js';
import {updateItem} from '../utils/common.js';

export default class BoardPresenter {
  #boardContainer = null;
  #popupContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #boardComponent = new BoardView();
  #sectionComponent = new SectionView();
  #sectionTopRatedComponent = new SectionView(isExtra, Titles.TOP_RATED);
  #sectionMostCommentedComponent = new SectionView(isExtra, Titles.MOST_COMMENTED);
  #loadMoreButtonComponent = null;
  #sortComponent = new SortView();
  #noFilmComponent = new EmptyListView();

  #boardFilms = [];
  #boardComments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsPresenter = new Map();

  constructor({boardContainer, popupContainer, filmsModel, commentsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#boardFilms = [...this.#filmsModel.films];
    this.#boardComments = [...this.#commentsModel.comments,];

    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if(this.#renderedFilmCount >= this.#boardFilms.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleFilmChange = (updatedFilm) => {
    this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    this.#filmsPresenter.get(updatedFilm.id).init(updatedFilm, this.#boardComments);
  };

  #renderSort() {
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilm(film, comments) {
    const filmPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleFilmChange,
    });
    filmPresenter.init(film, comments);
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderFilms(from, to) {
    this.#boardFilms.slice(from, to).forEach((film) => this.#renderFilm(film, this.#boardComments));
  }

  #renderExtraFilms = () => {
    const extraFilms = {
      TOP_RATED: getTopRatedFilms(this.#boardFilms),
      MOST_COMMENTED: getMostCommentedFilms(this.#boardFilms)
    };

    console.log(extraFilms.TOP_RATED);
  };

  #renderNoFilms() {
    this.#sectionComponent.element.innerHTML = '';
    render(this.#noFilmComponent, this.#sectionComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick,
    });

    render(this.#loadMoreButtonComponent, this.#sectionComponent.element);
  }

  #clearFilmList() {
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;

    remove(this.#loadMoreButtonComponent);
  }

  #renderFilmList() {
    this.#renderFilms(0, Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP));

    if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
    this.#renderExtraFilms();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    render(this.#sectionComponent, this.#boardComponent.element);
    render(this.#sectionTopRatedComponent, this.#boardComponent.element);
    render(this.#sectionMostCommentedComponent, this.#boardComponent.element);

    if (this.#boardFilms.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();
    this.#renderFilmList();
  }
}
