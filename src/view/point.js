import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToDateTime, formatStringToShortDate, formatStringToTime, getPointDuration,firstLetterToUpperCase } from '../utils.js';

function createPointViewTemplate({ point, pointDestination, pointOffers }) {
  const { type, offers, dateFrom, dateTo, price, isFavorite } = point;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const nameDestination = (pointDestination) ? pointDestination.name : '';
  return /* html */ `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToShortDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${firstLetterToUpperCase(type)} ${nameDestination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatStringToDateTime(dateTo)}">${formatStringToTime(dateTo)}</time>
          </p>
          <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate({ offers, pointOffers })}
        </ul>
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
    </li>
  `;
}

function createOffersTemplate({ offers, pointOffers }) {
  const selectedOffers = pointOffers.filter((offer) => offers.includes(offer.id));
  return selectedOffers.reduce((result, current) =>
    `${result}
      <li class="event__offer">
        <span class="event__offer-title">${current.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${current.price}</span>
      </li>
    `, '');
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #onRollupClick = null;
  #onFavoriteClick = null;
  constructor({ point, pointDestination, pointOffers, onRollupClick,onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = pointDestination;
    this.#offers = pointOffers.offers;
    this.#onRollupClick = onRollupClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  getTemplate() {
    return createPointViewTemplate({
      point: this.#point,
      pointDestination: this.#destination,
      pointOffers: this.#offers
    });
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
