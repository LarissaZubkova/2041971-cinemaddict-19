import {createElement} from '../render.js';

function createSectionTemplate() {
  return '<section class="films-list"></section>';
}

export default class SectionView {
  #element = null;

  get template() {
    return createSectionTemplate();
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
