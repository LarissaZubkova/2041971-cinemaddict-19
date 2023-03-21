import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presener.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './api-service.js/films-api-service.js';
import CommentsApiService from './api-service.js/comments-api-service.js';
import StatisticView from './view/statistics-view.js';

const AUTHORIZATION = 'Basic hS2sfS44wcj356hg';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer__statistics');

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
  filmsModel,
  profileContainer: siteHeaderElement,
});

filterPresenter.init();
boardPresenter.init();
filmsModel.init()
  .finally(() => {
    render(new StatisticView({filmsModel}), siteFooterElement);
  });
