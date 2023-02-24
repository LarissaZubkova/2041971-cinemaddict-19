import {render, remove} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SectionView from '../view/section-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {FILM_COUNT_PER_STEP} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #popupContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #boardComponent = new BoardView();
  #sectionComponent = new SectionView();
  #filmListComponent = new FilmListView();
  #loadMoreButtonComponent = null;

  #boardFilms = [];
  #boardComments = [];
  #renderFilmCount = FILM_COUNT_PER_STEP;

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
    this.#boardFilms.slice(this.#renderFilmCount, this.#renderFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#boardComments));

    this.#renderFilmCount += FILM_COUNT_PER_STEP;

    if(this.#renderFilmCount >= this.#boardFilms.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderFilm(film, comments) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const filmComponent = new FilmView({
      film,
      onDetailsClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const filmDetailsComponent = new FilmDetailsView({
      film,
      comments,
      onDetailsClose: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      this.#popupContainer.append(filmDetailsComponent.element);
    }

    function replaceFormToCard() {
      remove(filmDetailsComponent);
    }

    render(filmComponent, this.#filmListComponent.element);
  }

  #renderBoard() {
    if (this.#boardFilms.length === 0) {
      render(this.#boardComponent, this.#boardContainer);
      render(this.#sectionComponent, this.#boardComponent.element);
      this.#sectionComponent.element.innerHTML = '';
      render(new EmptyListView(), this.#sectionComponent.element);
      return;
    }
    render(new SortView, this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);
    render(this.#sectionComponent, this.#boardComponent.element);
    render(this.#filmListComponent, this.#sectionComponent.element);

    for (let i = 0; i < Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#boardFilms[i], this.#boardComments);
    }

    if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
      this.#loadMoreButtonComponent = new LoadMoreButtonView({
        onClick: this.#handleLoadMoreButtonClick,
      });
      render(this.#loadMoreButtonComponent, this.#sectionComponent.element);
    }
  }
}
