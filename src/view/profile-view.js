import AbstractView from '../framework/view/abstract-view.js';
import {WatchedFilmsProfile} from '../consts.js';

const getRating = (watchedFilms) => {
  if (watchedFilms > WatchedFilmsProfile.NOVICE && watchedFilms <= WatchedFilmsProfile.FAN) {
    return 'novice';
  }
  if (watchedFilms > WatchedFilmsProfile.FAN && watchedFilms <= WatchedFilmsProfile.MOVIE_BUFF) {
    return 'fan';
  }
  if (watchedFilms > WatchedFilmsProfile.MOVIE_BUFF) {
    return 'Movie buff';
  }
};

function createRatingTemplate(watchedFilms) {
  return `<p class="profile__rating">${getRating(watchedFilms)}</p>`;
}

function createProfileTemplate(watchedFilms) {
  return `<section class="header__profile profile">
    ${watchedFilms ? createRatingTemplate(watchedFilms) : ''}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
}

export default class ProfileView extends AbstractView{
  #watchedFilms = null;

  constructor({watchedFilms}) {
    super();
    this.#watchedFilms = watchedFilms;
  }


  get template() {
    return createProfileTemplate(this.#watchedFilms);
  }
}
