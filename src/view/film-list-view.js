import {createElement} from '../render.js';

function createFilmListTemplate() {
  return '<div class="films-list__container"></div>';
}

export default class FilmListView {
  #element = null;

  get template() {
    return createFilmListTemplate();
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
