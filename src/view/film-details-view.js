import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeFilmDate, formatDuration} from '../utils/film.js';
import {DateFormat, RALATIVE_TIME} from '../consts.js';
import {EMOTIONS} from '../mock/mock-consts.js';
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

function createCommentsTemplate(currentComments, commentsModel) {
  const commentsForFilm = commentsModel.filter((comment) => currentComments.includes(comment.id));

  return commentsForFilm.map((commentForFilm) => {
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
          <button class="film-details__comment-delete" id="${commentForFilm.id}">Delete</button>
    </p>
  </div>
</li>`;
  }).join(' ');
}

function createEmotionTemplate(checkedEmoji, emotions) {
  return emotions.map((emotion) => `
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${checkedEmoji === emotion ? 'checked' : ''} >
      <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img id="${emotion}" src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>
  `).join(' ');
}

function createFilmDetailsTemplate(film, commentsModel) {
  const {comments, filmInfo, userDetails, checkedEmoji} = film;
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
  const {watchlist, alreadyWatched, favorite} = userDetails;

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
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getControlsClassName(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${getControlsClassName(alreadyWatched)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${getControlsClassName(favorite)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${createCommentsTemplate(comments, commentsModel)}
        </ul>

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label">
            ${checkedEmoji ? `<img src="./images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmotionTemplate(checkedEmoji, EMOTIONS)}
          </div>
        </form>
      </section>
    </div>
  </div>
</section>`;
}

export default class FilmDetailsView extends AbstractStatefulView{
  #comments = null;
  #handleDetailsClose = null;
  #handleDeleteClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({film, comments, onDetailsClose, onWatchlistClick, onWatchedClick, onFavoriteClick, onDeleteClick}) {
    super();
    this.#comments = comments;
    this._setState(FilmDetailsView.parseCommentsToState(film));
    this.#handleDetailsClose = onDetailsClose;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._state, this.#comments);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#detailsCloseHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
    //this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#commentDeleteClickHandler));
  }

  #commentInputHandler = (evt) => {
    this._setState({
      userComment: evt.target.value
    });
    console.log(this._state)
  };

  #detailsCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleDetailsClose(FilmDetailsView.parseStateToFilm(this._state));
    document.querySelector('body').classList.remove('hide-overflow');
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #emojiClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();
    this.updateElement({
      checkedEmoji: evt.target.id,
    });
    this.element.scroll(0, currentScrollPosition);
  };

  // #commentDeleteClickHandler = (evt) => {
  //   evt.preventDefault();
  //   const deletedComment = this.#comments.find((comment) => Number(evt.target.id) === comment.id);
  //   this.#handleDeleteClick(deletedComment);
  // };

  static parseCommentsToState(film) {
    return {
      ...film,
      checkedEmoji: null,
      userComment: null,
    };
  }

  static parseStateToFilm(state) {
    const comment = {...state};

    delete comment.checkedEmoji;
    delete comment.userComment;

    return comment;
  }
}
