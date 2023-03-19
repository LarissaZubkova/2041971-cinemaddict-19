import AbstractView from '../framework/view/abstract-view.js';

const getRating = (watchedFilms) => {
  if (watchedFilms > 0 && watchedFilms <= 10) {
    return 'novice';
  }
  if (watchedFilms > 10 && watchedFilms <= 20) {
    return 'fan';
  }
  if (watchedFilms > 20) {
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
