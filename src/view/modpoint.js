import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, CITIES, POINT_EMPTY } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { firstLetterToUpperCase, firstLetterToLowerCase,formatStringToDateTime } from '../utils.js';

function createPointTypesListElement(currentType) {
  return POINT_TYPES.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${firstLetterToUpperCase(type)}</label>
    </div>`).join('');
}
function createPointDestinationListElement() {
  return `
    <datalist id="destination-list-1">
      ${CITIES.map((city) => `<option value="${city}"></option>`).join('')}
    </datalist>`;
}

function createPointOfferElement(offers, checkedOffers) {
  const offerItem = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${firstLetterToLowerCase(offer.title)}" ${checkedOffers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
  return `<div class="event__available-offers">${offerItem}</div>`;
}

function createPointPhotoElement(pictures) {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`;
}

function createModPointElement({point, destination, eventOffers}) {
  const { type, offers, dateFrom, dateTo, price } = point;
  const currentOffers = pointOffers.find((offer) => offer.type === type);
  const currentDestination = pointDestination.find((destination) => destination.id === point.destination);
  const nameDestination = (currentDestination) ? currentDestination.name : '';
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypesListElement(type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${nameDestination}" list="destination-list-1">
            ${createPointDestinationListElement()}
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatStringToDateTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatStringToDateTime(dateTo)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
        </header>
        <section class="event__details">
        ${(currentOffers.offers.length !== 0) ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            ${createPointOfferElement(currentOffers.offers, offers)}
          </section>` : ''}
          </section>
           ${(currentDestination) ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            ${createPointPhotoElement(currentDestination.pictures)}
          </section>` : ''}
        </section>
      </form>
    </li>`;
}

export default class EditablePointView extends  AbstractStatefulView {
  #pointDestination = null;
  #pointOffers = null;
  #onEditSubmit = null;
  #onRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = POINT_EMPTY, pointDestination, pointOffers, onEditSubmit, onResetClick}) {
    super();
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onEditSubmit = onEditSubmit;
    this.#onRollupClick = onResetClick;

    this._setState(EditablePointView.parseEventToState(point));
    this._restoreHandlers();
  }

  get template() {
    return createModPointElement({
      point: this._state,
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers
    });
  }

  reset(event) {
    this.updateElement(
      EventEditView.parseEventToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#editSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
  }

  #editSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onEditSubmit(EventEditView.parseStateToEvent(this._state));
  };
  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };
  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };
  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      ...this._state,
      offers: checkedBoxes.map((element) => element.id),
    });
  };
  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#pointDestination.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: (selectedDestination) ? selectedDestination.id : null,
    });
  };
  #priceChangeHandler = (evt) => {
    this._setState({
      ...this._state,
      price: evt.target.value,
    });
  };
  static parseEventToState(event) {
    return {...event};
  }
  static parseStateToEvent(state) {
    return {...state};
  }
}