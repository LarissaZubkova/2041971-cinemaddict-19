import {generateFilm} from '../mock/film.js';
import {FILM_COUNT} from '../const.js';

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, (_item, index) => generateFilm(index + 1));

  get films() {
    return this.#films;
  }
}
