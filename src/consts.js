const DateFormat = {
  RELEASE_FORMAT: 'YYYY',
  FORM_DATE_FORMAT: 'D MMMM YYYY',
  COMMENT_DATE_FORMAT: 'YYYY/MM/DD HH:mm',
};

const FILM_COUNT_PER_STEP = 5;

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

const FILMS_EXTRA_COUNT = 2;

const RALATIVE_TIME = {
  future: 'in %s',
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

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  DateFormat,
  FILM_COUNT_PER_STEP,
  FilterType,
  Titles,
  Mode,
  SortType,
  FILMS_EXTRA_COUNT,
  RALATIVE_TIME,
  UserAction,
  UpdateType,
};
