import {createElement} from '../render.js';
import {humanizeFilmDate, formatDuration} from '../utils.js';
import {DateFormat} from '../const.js';

function createFilmTemplate(film) {
  const {filmInfo, comments, userDetails} = film;
  const {title, totalRating, release, genre, poster, description, duration} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const year = humanizeFilmDate(release.date, DateFormat.RELEASE_FORMAT);
  const watchListClassName = watchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = favorite ? 'film-card__controls-item--active' : '';

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
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchListClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmView {
  constructor({film}) {
    this.film = film;
  }

  getTemplate() {
    return createFilmTemplate(this.film);
  }

  getElement() {
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
