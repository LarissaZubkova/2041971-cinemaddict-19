import AbstractView from '../framework/view/abstract-view.js';

function createFilteredCountTemplate(count) {
  return `<span class="main-navigation__item-count">${count}</span>`;
}

function getFiltersClassName(isActive) {
  return isActive ? 'main-navigation__item--active' : '';
}

function createFilterItemTemplate(filter, isActive) {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item ${getFiltersClassName(isActive)}">${name}
    ${name === 'all' ? '' : createFilteredCountTemplate(count)}
  </a>`;
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
