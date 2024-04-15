export default class PointsModel {
  #service = null;
  #points = null;
  constructor(service) {
    this.#service = service;
    this.#points = this.#service.points();
  }

  get() {
    return this.#points;
  }
}
