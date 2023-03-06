import AbstractView from '../framework/view/abstract-view.js';

function createSectionTemplate(isExtra, title) {
  return `<section class="films-list ${isExtra ? 'films-list films-list--extra' : ''}">
    <h2 class="films-list__title ${isExtra ? '' : 'visually-hidden'}">${title || 'All movies. Upcoming'}</h2>
    <div class="films-list__container"></div>
  </section>`;
}

export default class SectionView extends AbstractView{
  #isExtra = null;
  #title = null;

  constructor(isExtra, title) {
    super();
    this.#isExtra = isExtra;
    this.#title = title;
  }

  get template() {
    return createSectionTemplate(this.#isExtra, this.#title);
  }

  get filmListContainer() {
    return this.element.querySelector('.films-list__container');
  }
}
