import {createElement} from '../render.js';

function createEmptyListTemplate() {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
}

export default class EmptyListView {
  getTemplate() {
    return createEmptyListTemplate();
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
