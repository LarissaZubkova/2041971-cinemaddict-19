const DateFormat = {
  RELEASE_FORMAT: 'YYYY',
  FORM_DATE_FORMAT: 'D MMMM YYYY',
  COMMENT_DATE_FORMAT: 'YYYY/MM/DD HH:mm',
};

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const FILM_COUNT_PER_STEP = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const DURATION_DIGIT = 60;
const FILMS_EXTRA_COUNT = 2;

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const Titles = {
  TOP_RATED: 'Top Rated',
  MOST_COMMENTED: 'Most Commented',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const RALATIVE_TIME = {
  future: '%s',
  past: '%s',
  s: 'Today',
  m: 'Today',
  mm: 'Today',
  h: 'Today',
  hh: 'Today',
  d: 'a day ago',
  dd: '%d days ago',
  M: 'a month ago',
  MM: '%d months ago',
  y: 'a year ago',
  yy: '%d years ago',
};

const WatchedFilmsProfile = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const ErrorMessage = {
  ADD_COMMENT: 'Can\'t add comment',
  UPDATE_FILM: 'Can\'t update film',
};

const AUTHORIZATION = 'Basic hS2sfSff4wcj356hg';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

export {
  DateFormat,
  EMOTIONS,
  FILM_COUNT_PER_STEP,
  FilterType,
  Titles,
  Mode,
  SortType,
  FILMS_EXTRA_COUNT,
  RALATIVE_TIME,
  WatchedFilmsProfile,
  UserAction,
  UpdateType,
  MAX_DESCRIPTION_LENGTH,
  DURATION_DIGIT,
  Method,
  TimeLimit,
  ErrorMessage,
  AUTHORIZATION,
  END_POINT,
};
