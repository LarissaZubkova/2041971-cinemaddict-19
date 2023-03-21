import AbstractView from '../framework/view/abstract-view.js';
import {humanizeFilmDate, formatDuration} from '../utils/film.js';
import {DateFormat, MAX_DESCRIPTION_LENGTH} from '../consts.js';

function getControlsClassName(control) {
  return control ? 'film-card__controls-item--active' : '';
}

function getDescription(description) {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
  }
  return description;
}

function createFilmTemplate(film) {
  const {filmInfo, comments, userDetails} = film;
  const {title, totalRating, release, genre, poster, description, duration} = filmInfo;
  const {watchlist, watched, favorite} = userDetails;

  const year = humanizeFilmDate(release.date, DateFormat.RELEASE_FORMAT);

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${formatDuration(duration)}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${getDescription(description)}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlsClassName(watchlist)}" type="button" id="watchlist">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlsClassName(watched)}" type="button" id="watched">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${getControlsClassName(favorite)}" type="button" id="favorite">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmView extends AbstractView {
  #film = null;
  #handleDetailsClick = null;
  #handleControlsClick = null;

  constructor({film, onDetailsClick, onControlsClick}) {
    super();
    this.#film = film;
    this.#handleDetailsClick = onDetailsClick;
    this.#handleControlsClick = onControlsClick;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#detailsClickHandler);
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#controlsClickHandler);
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  #detailsClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDetailsClick();
    document.querySelector('body').classList.add('hide-overflow');
  };

  #controlsClickHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains('film-card__controls-item')) {
      return;
    }

    this.#handleControlsClick(evt.target);
  };
}
