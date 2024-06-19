import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';
import { formatStringToDateTime, formatStringToShortDate, formatStringToTime, getPointDuration,firstLetterToUpperCase } from '../presenters/utils.js';

function createCheckedOffersElement(offers, checkedOffers) {
  const offerItem = offers.map((offer) => checkedOffers.includes(offer.id) ? `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>` : '').join('');
  return `<ul class="event__selected-offers">${offerItem}</ul>`;
}

function createEventElement({event, eventDestination, eventOffers}) {
  const { type, offers, dateFrom, dateTo, price, isFavorite } = event;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const nameDestination = (eventDestination) ? eventDestination.name : '';
  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToShortDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${firstLetterToUpperCase(type)} ${he.encode(nameDestination)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatStringToDateTime(dateTo)}">${formatStringToTime(dateTo)}</time>
          </p>
          <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(String(price))}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createCheckedOffersElement(eventOffers.offers, offers)}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}

export default class PointView extends AbstractView {
  #event = null;
  #eventDestination = null;
  #eventOffers = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({event, eventDestination, eventOffers, onRollupClick, onFavoriteClick}) {
    super();
    this.#event = event;
    this.#eventDestination = eventDestination;
    this.#eventOffers = eventOffers;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventElement({
      event: this.#event,
      eventDestination: this.#eventDestination,
      eventOffers: this.#eventOffers
    });
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
