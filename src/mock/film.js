import {getRandomInteger, getRandomArrayElement, getRandomBool, generateFilmData, generateDates} from '../utils.js';
import {TITLE, IMAGES, IMAGES_PATH, ACTORS, COUNTRY, GENRE, DESCRIPTIONS, Digits} from '../const.js';

function generateDescription() {
  const currentDescription = [];
  for (let i = 1; i <= getRandomInteger(); i++) {
    currentDescription.push(getRandomArrayElement(DESCRIPTIONS));
  }
  return currentDescription.join(' ');
}

export function generateFilm(id) {
  const commentsGroup = Array.from({length:getRandomInteger(1, 10)}, (i, j) => getRandomInteger(j + 1));
  const comments = new Set(commentsGroup);
  const isWatched = getRandomBool();

  return {
    id,
    comments: [...comments],
    filmInfo: {
      title: getRandomArrayElement(TITLE),
      alternativeTitle: getRandomArrayElement(TITLE),
      totalRating: (Math.random() * Digits.MAX).toFixed(Digits.MIN),
      poster: `${IMAGES_PATH}${getRandomArrayElement(IMAGES)}`,
      ageRating: getRandomInteger(Digits.MIN, Digits.AGE_RATING),
      director: getRandomArrayElement(ACTORS),
      writers: generateFilmData(ACTORS),
      actors: generateFilmData(ACTORS),
      release: {
        date: generateDates().release,
        releaseCountry: getRandomArrayElement(COUNTRY),
      },
      duration: getRandomInteger(60, 180),
      genre: generateFilmData(GENRE),
      description: generateDescription(),
    },
    userDetails: {
      watchlist: isWatched ? false : getRandomBool(),
      alreadyWatched: isWatched,
      watchingDate: isWatched ? generateDates().watching : '',
      favorite: isWatched ? getRandomBool() : false,
    }
  };
}
