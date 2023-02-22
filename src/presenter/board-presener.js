import BoardView from '../view/board-view.js';
import SectionView from '../view/section-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render} from '../render.js';
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

    render(new SortView, this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);

    render(this.#sectionComponent, this.#boardComponent.element);
    render(this.#filmListComponent, this.#sectionComponent.element);

    for (let i = 0; i < Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#boardFilms[i], this.#boardComments);
    }

    if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
      this.#loadMoreButtonComponent = new LoadMoreButtonView();
      render(this.#loadMoreButtonComponent, this.#sectionComponent.element);

      this.#loadMoreButtonComponent.element.addEventListener('click', this.#loadMoreButtonClickHandler);
    }
  }

  #loadMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#boardFilms.slice(this.#renderFilmCount, this.#renderFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#boardComments));

    this.#renderFilmCount += FILM_COUNT_PER_STEP;

    if(this.#renderFilmCount >= this.#boardFilms.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderFilm(film, comments) {
    const filmComponent = new FilmView({film});
    const filmDetailsComponent = new FilmDetailsView({film, comments});

    const replaceCardToForm = () => {
      this.#popupContainer.append(filmDetailsComponent.element);
    };

    const replaceFormToCard = () => {
      filmDetailsComponent.element.remove();
    };

    const escKeyDownHandler = (evt) => {
      if(EventTarget.key === 'Escape' || EventTarget.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    filmDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(filmComponent, this.#filmListComponent.element);
  }
}
