import {createElement} from '../render.js';

function createFilmListTemplate() {
  return '<div class="films-list__container"></div>';
}

export default class FilmListView {
  getTemplate() {
    return createFilmListTemplate();
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
