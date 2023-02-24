import AbstractView from '../framework/view/abstract-view.js';

function createSectionTemplate(isExtra, title) {
  return `<section class="films-list" ${isExtra ? 'films-list films-list--extra' : ''}>
    <h2 class="films-list__title visually-hidden">${title || 'All movies. Upcoming'}</h2>
  </section>`;
}

export default class SectionView extends AbstractView{
  get template() {
    return createSectionTemplate();
  }
}
