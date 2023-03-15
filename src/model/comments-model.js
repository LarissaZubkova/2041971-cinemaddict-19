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

  addComment(updateType, update) {
    this.#comments = [
      update,
      ...this.#comments,
    ];
    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this.#comments.findIndex((comment) => comment.id === Number(update));

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
    this._notify(updateType, this.#comments);
  }
}
