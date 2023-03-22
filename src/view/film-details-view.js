import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeFilmDate, formatDuration, isCtrlPlusEnterPressed} from '../utils/film.js';
import {DateFormat, RALATIVE_TIME, EMOTIONS} from '../consts.js';
import dayjs from 'dayjs';
import require from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

function createGenreTemplate(genres) {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ');
}

function getControlsClassName(control) {
  return control ? 'film-details__control-button--active' : '';
}

function getCommentDate(date) {
  const relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);

  dayjs.updateLocale('en', {relativeTime: RALATIVE_TIME});

  const date1 = dayjs();
  const date2 = dayjs(date);

  return date1.diff(date2, 'week')
    ? dayjs(date).format(DateFormat.COMMENT_DATE_FORMAT)
    : dayjs(date).fromNow();
}

function createCommentsTemplate(commentsModel, isDisabled, isDeleting) {
  return commentsModel.map((commentForFilm) => {
    const {emotion, comment, author, date} = commentForFilm;

    return `<li class="film-details__comment">
     <span class="film-details__comment-emoji">
     <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
       <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getCommentDate(date)}</span>
          <button class="film-details__comment-delete" id="${commentForFilm.id}" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting' : 'Delete'}</button>
    </p>
  </div>
</li>`;
  }).join(' ');
}

function createEmotionTemplate(checkedEmoji, emotions, isDisabled) {
  return emotions.map((emotion) => `
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${checkedEmoji === emotion ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img id="${emotion}" src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>
  `).join(' ');
}

function createFilmDetailsTemplate(film, commentsModel, addedComment) {
  const {checkedEmoji, isDisabled, isDeleting} = addedComment;
  const {comments, filmInfo, userDetails} = film;
  const {
    poster,
    ageRating,
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    release,
    duration,
    genre,
    description
  } = filmInfo;
  const {watchlist, watched, favorite} = userDetails;

  return `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizeFilmDate(release.date, DateFormat.FORM_DATE_FORMAT)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatDuration(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${createGenreTemplate(genre)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getControlsClassName(watchlist)}" id="watchlist" name="watchlist" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${getControlsClassName(watched)}" id="watched" name="watched" ${isDisabled ? 'disabled' : ''}>Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${getControlsClassName(favorite)}" id="favorite" name="favorite" ${isDisabled ? 'disabled' : ''}>Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${createCommentsTemplate(commentsModel, isDisabled, isDeleting)}
        </ul>

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label">
            ${checkedEmoji ? `<img src="./images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmotionTemplate(checkedEmoji, EMOTIONS, isDisabled)}
          </div>
        </form>
      </section>
    </div>
  </div>
</section>`;
}

export default class FilmDetailsView extends AbstractStatefulView{
  #film = null;
  #comments = null;
  #handleDetailsClose = null;
  #handleDeleteClick = null;
  #handleAddCommentSubmit = null;
  #handleControlsClick = null;

  constructor({film, comments, onDetailsClose, onControlsClick, onDeleteClick, onCommentAdd}) {
    super();
    this.#film = film;
    this.#comments = comments;
    this._setState(FilmDetailsView.parseCommentToState());
    this.#handleDetailsClose = onDetailsClose;
    this.#handleControlsClick = onControlsClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleAddCommentSubmit = onCommentAdd;

    this._restoreHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments, this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#detailsCloseHandler);
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#controlsClickHandler);
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#commentDeleteClickHandler));
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#addCommentKeydownHandler);
    this.element.addEventListener('scroll', this.#scrollPositionHandler);
  }

  getScrollPosition() {
    return this._state.scrollPosition;
  }

  setScrollPosition(scrollPosition) {
    this.element.scrollTo(0, scrollPosition);
  }

  #scrollPositionHandler = () => {
    this._setState({ scrollPosition: this.element.scrollTop });
  };

  shakeControls = () => this.shake.call({element: this.element.querySelector('.film-details__controls')});

  shakeComment = (evt) => {
    console.log(evt.target)
    const button = this.element.querySelector(`.film-details__comment-delete[id='${commentId}']`);
    console.log(button)
    const comment = button.closest('.film-details__comment');

    this.shake.call({element: comment}, () => {
      this._setState({
        isDisabled: false,
        isDeleting: false,
      });
    });
  };

  shakeForm = () => {
    this.shake.call({element: document.querySelector('form')}, () => {
      this._setState({
        isDisabled: false
      });
    });
  };

  #detailsCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleDetailsClose(this.#film);
    document.querySelector('body').classList.remove('hide-overflow');
  };

  #controlsClickHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains('film-details__control-button')) {
      return;
    }

    this.#handleControlsClick(evt.target);
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedEmoji: evt.target.id,
      scrollPosition: this.element.scrollTop,
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  #commentInputHandler = (evt) => {
    this._setState({
      userComment: he.encode(evt.target.value)
    });
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollPosition: this.element.scrollTop
    });
    this.#handleDeleteClick(evt.target.id);
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  #addCommentKeydownHandler = (evt) => {
    if (isCtrlPlusEnterPressed(evt)) {
      const commentToAdd = {
        comment: this._state.userComment,
        emotion: this._state.checkedEmoji
      };
      this.updateElement({
        scrollPosition: this.element.scrollTop
      });
      this.#handleAddCommentSubmit(commentToAdd);
      this.element.scrollTo(0, this._state.scrollPosition);
    }
  };

  resetForm() {
    this.updateElement({
      userComment: '',
      checkedEmoji: '',
    });
  }

  static parseCommentToState() {
    return {
      checkedEmoji: null,
      userComment: null,
      isDisabled: false,
      isDeleting: false,
    };
  }

  static parseStateToComment(state) {
    const comment = {...state};

    delete comment.checkedEmoji;
    delete comment.userComment;
    delete comment.isDisabled;
    delete comment.isDeleting;

    return comment;
  }
}
