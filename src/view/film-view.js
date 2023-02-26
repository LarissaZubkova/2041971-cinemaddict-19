import AbstractView from '../framework/view/abstract-view.js';
import {humanizeFilmDate, formatDuration} from '../utils/film.js';
import {DateFormat} from '../const.js';

function getControlsClassName(control) {
  return control ? 'film-card__controls-item--active' : '';
}

function createFilmTemplate(film) {
  const {filmInfo, comments, userDetails} = film;
  const {title, totalRating, release, genre, poster, description, duration} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const year = humanizeFilmDate(release.date, DateFormat.RELEASE_FORMAT);

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${formatDuration(duration)}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlsClassName(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlsClassName(alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${getControlsClassName(favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmView extends AbstractView {
  #film = null;
  #handleDetailsClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({film, onDetailsClick, onWatchlistClick, onWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    this.#handleDetailsClick = onDetailsClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#detailsClickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  #detailsClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDetailsClick();
    document.querySelector('body').classList.add('hide-overflow');
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
}
