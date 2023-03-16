import Observable from '../framework/observable.js';

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
      const newComment = await this.#commentsApiService.addComment(update);
      this.#comments = [
        update,
        ...this.#comments,
      ];
      this._notify(updateType, newComment);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment(updateType, update) {
    return this.#commentsApiService.deleteComment(update)
      .then(() => {
        this.#comments = this.#comments.filter((comment) => comment.id !== update);
        this._notify(updateType, this.#comments);
      });
  }
}
