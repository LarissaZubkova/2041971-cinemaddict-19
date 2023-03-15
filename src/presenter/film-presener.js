import {render, remove, replace} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {Mode, UserAction, UpdateType} from '../consts.js';
import {nanoid} from 'nanoid';

export default class FilmPrsenter {
  #filmListContainer = null;
  #bodyElement = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #filmComponent = null;
  #filmDetailsComponent = null;

  #film = null;
  #commentsModel = null;
  #mode = Mode.DEFAULT;

  constructor({filmListContainer, bodyElement, onDataChange, onModeChange}) {
    this.#filmListContainer = filmListContainer;
    this.#bodyElement = bodyElement;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  async init(film, commentsModel) {
    this.#film = film;
    this.#commentsModel = commentsModel;

    const comments = await this.#commentsModel.getComments(this.#film.id);

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
      comments: comments,
      onDetailsClose: this.#handleDetailsClose,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteClick: this.#handleDeleteClick,
      onCommentAdd: this.#handleCommentAdd,
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
      return;
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
    this.#bodyElement.append(this.#filmDetailsComponent.element);
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
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist,
        }
      });
  };

  #handleWatchedClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched,
        }
      });
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite,
        }
      });
  };

  #handleDetailsClose = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (commentId) => {
    this.#handleDataChange(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      commentId,
    );
  };

  #handleCommentAdd = (commentToAdd) => {
    this.#handleDataChange(
      UserAction.ADD_COMMENT,
      UpdateType.MAJOR,
      {id: nanoid(), ...commentToAdd},
    );
  };
}
