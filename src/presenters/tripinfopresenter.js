import { render, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/tripinfo.js';

export default class TripInfoPresenter {
  #events = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor({tripInfoContainer, destinationsModel, offersModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(events) {
    this.#events = events;
    this.#destinations = [...this.#destinationsModel.get()];
    this.#offers = [...this.#offersModel.get()];

    this.#tripInfoComponent = new TripInfoView({
      destinations: this.#destinations,
      offers: this.#offers,
      events: this.#events
    });

    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}
