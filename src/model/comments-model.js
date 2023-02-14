import {generateComment} from '../mock/comments.js';

export default class CommentModel {
  comment = generateComment();

  getComments() {
    return this.comment;
  }
}
