import {getRandomArrayElement, getRandomInteger, generateDates} from '../utils.js';
import {ACTORS, DESCRIPTIONS, EMOTION} from '../const.js';

function generateComment(id) {
  return {
    id,
    author: getRandomArrayElement(ACTORS),
    comment: getRandomArrayElement(DESCRIPTIONS),
    date: generateDates().comment,
    emotion: getRandomArrayElement(EMOTION),
  };
}

export function generateComments() {
   return Array.from({length: 10}, (_item, index) => generateComment(index + 1));
}