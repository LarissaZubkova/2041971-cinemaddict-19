import {render} from './framework/render.js';
import ProfileView from './view/profile-view.js';
import BoardPresenter from './presenter/board-presener.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './api-service.js/films-api-service.js';
import CommentsApiService from './api-service.js/comments-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wc3f5u88';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const filmsModel = new FilmsModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)
});
const commentsModel = new CommentsModel({
  commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION),
});

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
filmsModel.init();
