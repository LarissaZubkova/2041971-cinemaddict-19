import AbstractView from '../framework/view/abstract-view.js';

function createFilmListTemplate() {
  return '<div class="films-list__container"></div>';
}

export default class FilmListView extends AbstractView{
  get template() {
    return createFilmListTemplate();
  }
}
