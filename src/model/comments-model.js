import Observable from '../framework/observable.js';
import {ErrorMessage} from '../consts.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = null;

  constructor({commentsApiService}) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  async getComments(id) {
    try {
      this.#comments = await this.#commentsApiService.getComments(id);
    } catch(err) {
      this.#comments = [];
    }
    return this.#comments;
  }

  async addComment(updateType, update) {
    try {
      const newData = await this.#commentsApiService.addComment(update.film.id, update.comment);
      const film = {
        ...update.film,
        comments: newData.movie.comments,
      };
      this._notify(updateType, film);
    } catch(err) {
      throw new Error(ErrorMessage.ADD_COMMENT);
    }
  }

  deleteComment(updateType, update) {
    return this.#commentsApiService.deleteComment(update.commentId)
      .then(() => {
        const film = {
          ...update.film,
          comments: update.film.comments.filter((comment) => comment !== update.commentId),
        };
        this._notify(updateType, film);
      });
  }
}
