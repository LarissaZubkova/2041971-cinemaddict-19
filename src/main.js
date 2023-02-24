import {render} from './framework/render.js';
import ProfileView from './view/profile-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presener.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  popupContainer: bodyElement,
  filmsModel,
  commentsModel,
});

render(new ProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);

boardPresenter.init();
