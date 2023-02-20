import {generateComments} from '../mock/comments.js';

export default class ComgenerateCommentsmentsModel {
  #comment = generateComments();

  get comments() {
    return this.#comment;
  }
}
