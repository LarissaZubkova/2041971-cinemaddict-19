import AbstractView from '../framework/view/abstract-view.js';

function createStatisticsTemplate(filmsModel) {
  return `<p>${filmsModel.films.length} movies inside</p>`;
}

export default class StatisticView extends AbstractView {
  #filmsModel = null;

  constructor({filmsModel}) {
    super();
    this.#filmsModel = filmsModel;
  }

  get template() {
    return createStatisticsTemplate(this.#filmsModel);
  }
}
