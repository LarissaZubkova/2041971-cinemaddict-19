import {getRandomArrayElement} from '../utils.js';
import {ACTORS, DESCRIPTIONS, EMOTION} from '../const.js';

export function generateComment(id) {
  return {
    id,
    author: getRandomArrayElement(ACTORS),
    comment: getRandomArrayElement(DESCRIPTIONS),
    date: null,
    emotion: getRandomArrayElement(EMOTION),
  };
}
