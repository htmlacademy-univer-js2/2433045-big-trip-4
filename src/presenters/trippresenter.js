import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import PointPresenter from './pointpresenter.js';
import NoPointView from '../view/nopoint.js';
import { updateItem } from '../utils.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripPointsPresenter {
  #listComponent = new ListView();
  #sortComponent = new SortView();
  #noPointComponent = new NoPointView();
  #tripContainer = null;
  #points = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #pointPresenters = new Map();

  constructor({tripContainer, destinationsModel, offersModel, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#tripContainer = tripContainer;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderTrip();
  }

  #renderTrip() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  }

  #renderPointContainer() {
    render(this.#listComponent, this.#tripContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoints() {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #handleEventChange = (updatedEvent) => {
    this.#points = updateItem(this.#points, updatedEvent);
    this.#pointPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#listComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
