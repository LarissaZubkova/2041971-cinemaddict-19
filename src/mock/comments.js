import {getRandomArrayElement} from '../utils/common.js';
import {generateDates} from '../utils/film.js';
import {COMMENTS_COUNT, ACTORS, DESCRIPTIONS, EMOTIONS} from './mock-consts.js';

function generateComment(id) {
  return {
    id,
    author: getRandomArrayElement(ACTORS),
    comment: getRandomArrayElement(DESCRIPTIONS),
    date: generateDates().comment,
    emotion: getRandomArrayElement(EMOTIONS),
  };
}

export function generateComments() {
  return Array.from({length: COMMENTS_COUNT}, (_item, index) => generateComment(index + 1));
}
