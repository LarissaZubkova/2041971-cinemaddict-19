import Observable from '../framework/observable.js';
import {generateComments} from '../mock/comments.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #filmsModel = null;
  #comments = generateComments();

  constructor({commentsApiService, filmsModel}) {
    super();
    this.#commentsApiService = commentsApiService;
    this.#filmsModel = filmsModel;
    console.log(this.#filmsModel.films);
    this.#filmsModel.films.forEach(film => {
      this.#commentsApiService.getComments(film.id).then((comments) => {
        console.log(comments);
      });
    });
  }


  get comments() {
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
