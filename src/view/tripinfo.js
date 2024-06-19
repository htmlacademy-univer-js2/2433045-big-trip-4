import AbstractView from '../framework/view/abstract-view.js';
import { getTripTitle, getTripDuration, getTripCost } from '../presenters/utils.js';

function createTripInfoElement({ isEmpty, title, duration, cost}) {
  return `${isEmpty
    ? '<div></div>'
    : `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${duration}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
        </p>
      </section>`}`;
}

export default class TripInfoView extends AbstractView {
  #destinations = null;
  #offers = null;
  #events = 0;

  constructor({destinations, offers, events}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#events = events;
  }

  get template() {
    return createTripInfoElement({
      isEmpty: this.#events.length === 0,
      title: getTripTitle(this.#events, this.#destinations),
      duration: getTripDuration(this.#events),
      cost: getTripCost(this.#events, this.#offers),
    });
  }
}
