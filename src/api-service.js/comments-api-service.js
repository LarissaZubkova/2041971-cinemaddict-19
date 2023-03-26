import ApiService from '../framework/api-service.js';
import {Method} from '../consts.js';

export default class CommentsApiService extends ApiService {
  async getComments(id) {
    return this._load({url: `comments/${id}`})
      .then(ApiService.parseResponse);
  }

  async addComment(id, comment) {
    const response = await this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteComment(id) {
    const response = await this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
