import BoardView from '../view/board-view.js';
import SectionView from '../view/section-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  sectionComponent = new SectionView();
  filmListComponent = new FilmListView();

  constructor({boardContainer, filmsModel, commentsModel}) {
    this.boardContainer = boardContainer;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;
  }

  init() {
    this.boardFilms = [...this.filmsModel.getFilms()];

    render(new SortView, this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(this.sectionComponent, this.boardComponent.getElement());
    render(this.filmListComponent, this.sectionComponent.getElement());

    for (let i = 1; i < this.boardFilms.length; i++) {
      render(new FilmView({film: this.boardFilms[i]}), this.filmListComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.sectionComponent.getElement());
  }
}
