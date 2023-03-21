import {render, remove, replace} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {Mode, UserAction, UpdateType, FilterType} from '../consts.js';

export default class FilmPrsenter {
  #filmListContainer = null;
  #bodyElement = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #filmComponent = null;
  #filmDetailsComponent = null;

  #film = null;
  #comments = null;
  #filterType = null;
  #mode = Mode.DEFAULT;

  constructor({filmListContainer, filterType, bodyElement, onDataChange, onModeChange}) {
    this.#filmListContainer = filmListContainer;
    this.#filterType = filterType;
    this.#bodyElement = bodyElement;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  async init(film, comments) {
    this.#film = film;
    this.#comments = comments;

    const commentsForFilm = await this.#comments.getComments(this.#film.id);
    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmComponent = new FilmView({
      film: this.#film,
      onDetailsClick: this.#handleDetailsClick,
      onControlsClick:this.#handleControlsClick,
    });

    this.#filmDetailsComponent = new FilmDetailsView({
      film: this.#film,
      comments: [...commentsForFilm],
      onDetailsClose: this.#handleDetailsClose,
      onControlsClick:this.#handleControlsClick,
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
      replace(this.#filmComponent, prevFilmComponent);
      return;
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this.#filmComponent);
    //remove(this.#filmDetailsComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  setDeleting() {
    if (this.#mode === Mode.DETAILS) {
      this.#filmDetailsComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setSaving() {
    if (this.#mode === Mode.DETAILS) {
      this.#filmDetailsComponent.updateElement({
        isDisabled: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#filmComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#filmDetailsComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#filmDetailsComponent.shake(resetFormState);
  }

  #replaceCardToForm() {
    this.#bodyElement.append(this.#filmDetailsComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.DETAILS;
    this.#filmDetailsComponent.resetForm();
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

  #handleControlsClick = (control) => {
    let updateType;
    if (this.#filterType === FilterType.ALL || !this.#filterType){
      updateType = UpdateType.PATCH;
    } else {
      updateType = UpdateType.MINOR;
    }

    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      updateType,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          [control.id]: !this.#film.userDetails[control.id],
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
      UpdateType.PATCH,
      {
        commentId,
        film: this.#film,
      }
    );
  };

  #handleCommentAdd = (comment) => {
    const film = this.#film;
    this.#handleDataChange(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        comment,
        film
      },
    );
  };
}
