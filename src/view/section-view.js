import {createElement} from '../render.js';

function createSectionTemplate() {
  return '<section class="films-list"></section>';
}

export default class SectionView {
  getTemplate() {
    return createSectionTemplate();
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
