import {getRandomArrayElement, generateDates} from '../utils.js';
import {ACTORS, DESCRIPTIONS, EMOTIONS} from '../const.js';

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
  return Array.from({length: 10}, (_item, index) => generateComment(index + 1));
}
