import Observable from '../framework/observable.js';
import { updateItem, adaptToClient } from '../utils.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #apiService = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  constructor ({pointApiService, destinationsModel, offersModel}) {
    super();
    this.#apiService = pointApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get() {
    return this.#points;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);

      const points = await this.#apiService.points;
      this.#points = points.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    }

    catch(err) {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  async updateEvent(updateType, update) {
    try {
      const response = await this.#apiService.updateEvent(update);
      const updatedPoint = adaptToClient(response);
      this.#points = updateItem(this.#points, updatedPoint);
      this._notify(updateType, updatedPoint);
    }

    catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  addPoint(updateType, update) {
    this.#points.push(update);
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((pointItem) => pointItem.id !== update.id);
    this._notify(updateType);
  }
}
