import {render} from './framework/render.js';
import ProfileView from './view/profile-view.js';
import BoardPresenter from './presenter/board-presener.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  bodyElement: bodyElement,
  filmsModel,
  commentsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  filmsModel
});

render(new ProfileView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
