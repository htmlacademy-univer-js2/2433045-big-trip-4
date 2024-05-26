import Observable from '../framework/observable.js';
import { updateItem } from '../utils.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = null;

  constructor (service) {
    super();
    this.#service = service;
    this.#points = this.#service.points();
  }

  get() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    this.#points = updateItem(this.#points, update);
    this._notify(updateType, update);
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