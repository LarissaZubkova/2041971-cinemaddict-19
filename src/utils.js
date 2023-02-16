import dayjs from 'dayjs';

const getRandomInteger = (a = 1, b = 5) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeFilmDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function formatDuration(duration) {
  return `${Math.floor(duration / 60)}h ${duration % 60}m`;
}

function getRandomBool(probability = 0.5) {
  return Math.random() <= probability;
}

function generateFilmData(data) {
  const currentData = [];
  for (let i = 1; i <= getRandomInteger(); i++) {
    currentData.push(getRandomArrayElement(data));
  }
  return currentData;
}

function generateDates() {
  const MAX_GAP = 14;
  const MIN_GAP = 1;
  const releaseDate = dayjs('1950-01-01')
    .add(getRandomInteger(-MAX_GAP, MAX_GAP), 'year')
    .add(getRandomInteger(-MAX_GAP, MAX_GAP), 'month')
    .add(getRandomInteger(-MAX_GAP, MAX_GAP), 'day');

  const watchingDate = dayjs()
    .add(getRandomInteger(0, -MAX_GAP), 'year')
    .add(getRandomInteger(0, -MAX_GAP), 'month')
    .add(getRandomInteger(0, -MAX_GAP), 'day');

  const commentDate = dayjs()
    .add(getRandomInteger(0, 0), 'year')
    .add(getRandomInteger(0, 0), 'month')
    .add(getRandomInteger(0, -MAX_GAP), 'day');

  return {
    release: releaseDate.toISOString(),
    watching: watchingDate.toISOString(),
    comment: commentDate.toISOString(),
  };
}

export {getRandomInteger,
  getRandomArrayElement,
  humanizeFilmDate,
  formatDuration,
  getRandomBool,
  generateFilmData,
  generateDates};
