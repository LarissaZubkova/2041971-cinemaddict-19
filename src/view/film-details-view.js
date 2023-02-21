import {createElement} from '../render.js';
import {humanizeFilmDate, formatDuration} from '../utils.js';
import {DateFormat, EMOTIONS} from '../const.js';
import dayjs from 'dayjs';
import require from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

const BLANK_FILM = {
  id: '',
  comments: [],
  filmInfo: {
    title: '',
    alternativeTitle: '',
    totalRating: '',
    poster: '',
    ageRating: '',
    director: '',
    writers: [],
    actors: [],
    release: {
      date: null,
      releaseCountry: '',
    },
    duration: '',
    genre: [],
    description: '',
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: false,
    watchingDate: null,
    favorite: false,
  }
};

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

  dayjs.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s',
      s: 'Today',
      m: 'Today',
      mm: 'Today',
      h: 'Today',
      hh: 'Today',
      d: 'a day ago',
      dd: '%d days ago',
      M: 'a month ago',
      MM: '%d months ago',
      y: 'a year ago',
      yy: '%d years ago',
    }
  });
  const date1 = dayjs();
  const date2 = dayjs(date);

  return date1.diff(date2, 'week')
    ? dayjs(date).format(DateFormat.COMMENT_DATE_FORMAT)
    : dayjs(date).fromNow();
}

function createCommentTemplate(currentComments, commentsModel) {
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
        <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
  }).join(' ');
}

function createEmotionTemplate(emotions) {
  return emotions.map((emotion) => `
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>
  `).join(' ');
}

function createFilmDetailsTemplate(film, commentsModel) {
  const {comments, filmInfo, userDetails} = film;
  const {poster,
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
    description} = filmInfo;
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
              <td class="film-details__term">Genres</td>
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
        ${createCommentTemplate(comments, commentsModel)}
        </ul>

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
          ${createEmotionTemplate(EMOTIONS)}
          </div>
        </form>
      </section>
    </div>
  </div>
</section>`;
}

export default class FilmDetailsView {
  #element = null;
  #film = null;
  #comments = null;

  constructor({film = BLANK_FILM, comments}) {
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }

  get element() {
    if(!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
