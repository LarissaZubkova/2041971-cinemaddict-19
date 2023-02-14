import {createElement} from '../render.js';

function createBoardTemplate() {
  return '<section class="films"></section>';
}

export default class BoardView {
  getTemplate() {
    return createBoardTemplate();
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
