import {createElement} from '../render.js';

function createStatisticsTemplate() {
  return '<p>130 291 movies inside</p>';
}

export default class StatisticView {
  getTemplate() {
    return createStatisticsTemplate();
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
