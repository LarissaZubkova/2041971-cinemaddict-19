import dayjs from 'dayjs';
import {FILMS_EXTRA_COUNT, DURATION_DIGIT} from '../consts.js';

function humanizeFilmDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function formatDuration(duration) {
  return `${Math.floor(duration / DURATION_DIGIT)}h ${duration % DURATION_DIGIT}m`;
}

const isExtra = true;

const getTopRatedFilms = (films) => Array.from(films.values())
  .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
  .slice(0, FILMS_EXTRA_COUNT);


const getMostCommentedFilms = (films) => Array.from(films.values())
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, FILMS_EXTRA_COUNT);

function getWeightForNullData(dataA, dataB) {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
}

function sortByDate(filmA, filmB) {
  const weight = getWeightForNullData(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
}

function sortByRating(filmA, filmB) {
  const weight = getWeightForNullData(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);
  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
}

function isCtrlPlusEnterPressed(evt) {
  return evt.metaKey && evt.code === 'Enter' || evt.ctrlKey && evt.code === 'Enter';
}

export {
  humanizeFilmDate,
  formatDuration,
  isExtra,
  getTopRatedFilms,
  getMostCommentedFilms,
  sortByDate,
  sortByRating,
  isCtrlPlusEnterPressed,
};
