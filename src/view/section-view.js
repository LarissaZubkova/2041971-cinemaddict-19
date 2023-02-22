import {createElement} from '../render.js';

function createSectionTemplate(isExtra, title) {
  return `<section class="films-list" ${isExtra ? 'films-list films-list--extra' : ''}>
    <h2 class="films-list__title visually-hidden">${title || 'All movies. Upcoming'}</h2>
  </section>`;
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
