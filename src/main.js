import ProfileView from './view/profile-view.js';
import FilterView from './view/filter-view.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presener.js';
import FilmEditView from './view/film-edit-view.js';
import FilmsModel from './model/film-model.js';
import CommentsModel from './model/comments-model.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  filmsModel,
  commentsModel,
});

render(new ProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new FilmEditView({film: filmsModel.getFilms()[0], comments: commentsModel.getComments()}), bodyElement);

boardPresenter.init();
