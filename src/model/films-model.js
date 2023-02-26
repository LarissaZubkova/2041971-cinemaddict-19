import {generateFilm} from '../mock/film.js';
import {FILM_COUNT} from '../const.js';

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }
}
