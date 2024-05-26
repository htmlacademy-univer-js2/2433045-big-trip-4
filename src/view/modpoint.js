import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, CITIES, POINT_EMPTY,EditType, ButtonLabel } from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';
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


function createResetButtonTemplate(pointType) {
  const label = pointType === EditType.CREATING
    ? ButtonLabel.CANCEL_DEFAULT
    : ButtonLabel.DELETE_DEFAULT;
  return `<button class="event__reset-btn" type="reset">${label}</button>`;
}

function createModPointElement({point, pointDestination, pointOffers, pointType}) {
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(nameDestination)}" list="destination-list-1">
            ${createPointDestinationListElement()}
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? formatStringToDateTime(dateFrom) : ''}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? formatStringToDateTime(dateTo) : ''}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(price.toString())}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${ButtonLabel.SAVE_DEFAULT}</button>
          ${createResetButtonTemplate(pointType)}
          ${(pointType === EditType.EDITING) ? '<button class="event__rollup-btn" type="button">' : ''}
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

export default class EditablePointView extends AbstractStatefulView {
  #pointDestination = null;
  #pointOffers = null;
  #onEditSubmit = null;
  #onEditReset = null;
  #onRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #pointType;

  constructor({point = POINT_EMPTY, pointDestination, pointOffers, onEditSubmit, onRollupClick, onEditReset,pointType = EditType.EDITING}) {
    super();
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onEditSubmit = onEditSubmit;
    this.#onEditReset = onEditReset;
    this.#onRollupClick = onRollupClick;
    this.#pointType = pointType;

    this._setState(EditablePointView.parsePointToState(point));
    this._restoreHandlers();
  }

  get template() {
    return createModPointElement({
      point: this._state,
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers,
      pointType: this.#pointType
    });
  }

  reset(point) {
    this.updateElement(
      EditablePointView.parsePointToState(point),
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
    .addEventListener('submit', this.#editSubmitHandler);
    if (this.#pointType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
      this.element.querySelector('.event--edit')
      .addEventListener('reset', this.#editResetHandler);
    }
    if (this.#pointType === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#editResetHandler);
    }
    this.element.querySelector('.event__type-group')
    .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__available-offers')
    ?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination')
    .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
    .addEventListener('change', this.#priceChangeHandler);
    this.#setDatepickers();
  }

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate});
      this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate});
      this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatepickers() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom,
      },
    );
  }

  #editSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onEditSubmit(EditablePointView.parseStateToEvent(this._state));
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
    if (isNaN(Number(evt.target.value))) {
      return this._state;
    }
    this._setState({
      ...this._state,
      price: evt.target.value,
    });
  };

  #editResetHandler = (evt) => {
    evt.preventDefault();
    this.#onEditReset(EditablePointView.parseStateToEvent(this._state));
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
