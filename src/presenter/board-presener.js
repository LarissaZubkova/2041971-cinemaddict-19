import {render, remove, RenderPosition} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {FILM_COUNT_PER_STEP, Titles, SortType, UpdateType, UserAction} from '../consts.js';
import {isExtra, getTopRatedFilms, getMostCommentedFilms, sortByDate, sortByRating} from '../utils/film.js';
import FilmPrsenter from './film-presener.js';

export default class BoardPresenter {
  #boardContainer = null;
  #popupContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #boardComponent = new BoardView();
  #filmsListComponent = new FilmsListView();
  #sectionTopRatedComponent = new FilmsListView(isExtra, Titles.TOP_RATED);
  #sectionMostCommentedComponent = new FilmsListView(isExtra, Titles.MOST_COMMENTED);
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #noFilmComponent = new EmptyListView();

  #boardComments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsPresenter = new Map();
  #filmsTopRatedPresenter = new Map();
  #filmsMostCommentedPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({boardContainer, popupContainer, filmsModel, commentsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortByRating);
    }

    return this.#filmsModel.films;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init() {
    this.#boardComments = [...this.#commentsModel.comments];
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    const filmCount = this.films.length;

    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.filmss.slice(this.#renderedFilmCount, newRenderedFilmCount);

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

  #handleFilmChange = (updatedFilm) => {
    // this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    // this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedFilm);
    this.#filmsPresenter.get(updatedFilm.id).init(updatedFilm, this.#boardComments);
  };

  #handleTopRatedFilmChange = (updatedFilm) => {
    // this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    // this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedFilm);
    this.#filmsTopRatedPresenter.get(updatedFilm.id).init(updatedFilm, this.#boardComments);
  };

  #handleMostCommentedFilmChange = (updatedFilm) => {
    // this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    // this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedFilm);
    this.#filmsMostCommentedPresenter.get(updatedFilm.id).init(updatedFilm, this.#boardComments);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, film) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#filmsPresenter.get(film.id).init(film, this.#boardComments);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }

  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPrsenter({
      filmListContainer: this.#filmsListComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    filmPresenter.init(film, this.#boardComments);
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderTopRatedFilm(film) {
    const topRatedPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionTopRatedComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleTopRatedFilmChange,
      onModeChange: this.#handleModeChange,
    });

    topRatedPresenter.init(film, this.#boardComments);
    this.#filmsTopRatedPresenter.set(film.id, topRatedPresenter);
  }

  #renderMostCommentedFilm(film) {
    const mostCommentedPresenter = new FilmPrsenter({
      filmListContainer: this.#sectionMostCommentedComponent.filmListContainer,
      popupContainer: this.#popupContainer,
      onDataChange: this.#handleMostCommentedFilmChange,
      onModeChange: this.#handleModeChange,
    });

    mostCommentedPresenter.init(film, this.#boardComments);
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

  #renderNoFilms() {
    remove(this.#filmsListComponent);
    remove(this.#sectionTopRatedComponent);
    remove(this.#sectionMostCommentedComponent);

    render(this.#noFilmComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick,
    });

    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  }

  #clearFilmList() {
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#filmsTopRatedPresenter.clear();
    this.#filmsMostCommentedPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;

    remove(this.#loadMoreButtonComponent);
  }

  #renderFilmList() {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    this.#renderFilms(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }

    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#boardComponent.element);
    render(this.#sectionTopRatedComponent, this.#boardComponent.element);
    render(this.#sectionMostCommentedComponent, this.#boardComponent.element);

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmList();
  }
}
