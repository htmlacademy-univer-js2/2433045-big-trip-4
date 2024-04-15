import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import EditablePointView from '../view/modpoint.js';
import PointView from '../view/point.js';
import {render, replace} from '../framework/render.js';

export default class TripEventsPresenter {
  #listComponent = new ListView();
  #points = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #container = null;

  constructor({ destinationsModel, offersModel, pointsModel, container }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#container = container;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    render(new SortView(), this.#container);
    render(this.#listComponent, this.#container);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditorToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#pointsModel.getByType(point.type),
      onRollupClick: () => {
        replaceEventToEditor();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const modPointComponent = new EditablePointView({
      point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onEditSubmit: () => {
        replaceEditorToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onResetClick: () => {
        replaceEditorToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceEventToEditor() {
      replace(modPointComponent, pointComponent);
    }

    function replaceEditorToEvent() {
      replace(pointComponent, modPointComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }
}
