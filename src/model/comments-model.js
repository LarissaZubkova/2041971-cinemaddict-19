import {generateComments} from '../mock/comments.js';

export default class ComgenerateCommentsmentsModel {
  comment = generateComments();

  getComments() {
    return this.comment;
  }
}
