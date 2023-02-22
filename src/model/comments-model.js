import {generateComments} from '../mock/comments.js';

export default class CommentsModel {
  #comment = generateComments();

  get comments() {
    return this.#comment;
  }
}
