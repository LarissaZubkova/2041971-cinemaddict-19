import {render, remove, replace} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {Mode} from '../const.js';

export default class FilmPrsenter {
  #filmListContainer = null;
  #popupContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #filmComponent = null;
  #filmDetailsComponent = null;

  #film = null;
  #comments = null;
  #mode = Mode.DEFAULT;

  constructor({filmListContainer, popupContainer, onDataChange, onModeChange}) {
    this.#filmListContainer = filmListContainer;
    this.#popupContainer = popupContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(film, comments) {
    this.#film = film;
    this.#comments = comments;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmComponent = new FilmView({
      film: this.#film,
      onDetailsClick: this.#handleDetailsClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#filmDetailsComponent = new FilmDetailsView({
      film: this.#film,
      comments: this.#comments,
      onDetailsClose: this.#handleDetailsClose,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.DETAILS) {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this.#filmComponent);
    remove(this.#filmDetailsComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    this.#popupContainer.append(this.#filmDetailsComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.DETAILS;
  }

  #replaceFormToCard() {
    remove(this.#filmDetailsComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleDetailsClick = () => {
    this.#replaceCardToForm();
  };

  #handleWatchlistClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist,
      }
    });
  };

  #handleWatchedClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite,
      }
    });
  };

  #handleDetailsClose = (film) => {
    this.#replaceFormToCard();
    this.#handleDataChange(film);

  };
}
