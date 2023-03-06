import {render, remove, RenderPosition} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SectionView from '../view/section-view.js';
import SortView from '../view/sort-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {FILM_COUNT_PER_STEP, Titles, SortType} from '../consts.js';
import {isExtra, getTopRatedFilms, getMostCommentedFilms, sortByDate, sortByRating} from '../utils/film.js';
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
  #sortComponent = null;
  #noFilmComponent = new EmptyListView();
  #sourcedBoardFilms = [];

  #boardFilms = [];
  #boardComments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsPresenter = new Map();
  #filmsExtraPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({boardContainer, popupContainer, filmsModel, commentsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#boardFilms = [...this.#filmsModel.films];
    this.#boardComments = [...this.#commentsModel.comments,];
    this.#sourcedBoardFilms = [...this.#filmsModel.films];
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if(this.#renderedFilmCount >= this.#boardFilms.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.resetView());
    this.#filmsExtraPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedFilm);
    this.#filmsPresenter.get(updatedFilm.id).init(updatedFilm, this.#boardComments);
    this.#filmsExtraPresenter.get(updatedFilm.id).init(updatedFilm, this.#boardComments);
  };

  #sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this.#boardFilms.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#boardFilms.sort(sortByRating);
        break;
      default:
        this.#boardFilms = [...this.#sourcedBoardFilms];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilm(film, comments) {
    const filmPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleFilmChange,
      onModeChange: this.#handleModeChange,
    });

    filmPresenter.init(film, comments);
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderTopRatedFilm(film, comments) {
    const topRatedPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionTopRatedComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleFilmChange,
      onModeChange: this.#handleModeChange,
    });

    topRatedPresenter.init(film, comments);
    this.#filmsExtraPresenter.set(film.id, topRatedPresenter);
  }

  #renderMostCommentedFilm(film, comments) {
    const mostCommentedPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionMostCommentedComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleFilmChange,
      onModeChange: this.#handleModeChange,
    });

    mostCommentedPresenter.init(film, comments);
    this.#filmsExtraPresenter.set(film.id, mostCommentedPresenter);
  }

  #renderFilms(from, to) {
    this.#boardFilms.slice(from, to).forEach((film) => this.#renderFilm(film, this.#boardComments));
  }

  #renderTopRatedFilms() {
    const topRatedFilms = getTopRatedFilms(this.#boardFilms);
    topRatedFilms.forEach((film) => this.#renderTopRatedFilm(film, this.#boardComments));
  }

  #renderMostCommentedFilms() {
    const mostCommentedFilms = getMostCommentedFilms(this.#boardFilms);
    mostCommentedFilms.forEach((film) => this.#renderMostCommentedFilm(film, this.#boardComments));
  }

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
    this.#filmsExtraPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#filmsExtraPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;

    remove(this.#loadMoreButtonComponent);
  }

  #renderFilmList() {
    this.#renderFilms(0, Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP));

    if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
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
