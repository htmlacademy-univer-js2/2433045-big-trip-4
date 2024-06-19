import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY, EditType, ButtonLabel } from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import { firstLetterToUpperCase, firstLetterToLowerCase,formatStringToDateTime } from '../presenters/utils.js';

function createEventTypesListElement(eventOffers, currentType, isDisabled) {
  return eventOffers.map((event) =>
    `<div class="event__type-item">
      <input id="event-type-${event.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event.type}" ${currentType === event.type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${event.type}" for="event-type-${event.type}-1">${firstLetterToUpperCase(event.type)}</label>
    </div>`).join('');
}

function createEventDestinationListElement(eventDestination) {
  return `
    <datalist id="destination-list-1">
      ${eventDestination.map((destination) => `<option value="${destination.name}"></option>`).join('')}
    </datalist>`;
}

function createEventOfferElement(offers, checkedOffers, isDisabled) {
  const offerItem = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${firstLetterToLowerCase(offer.title)}" ${checkedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
  return `<div class="event__available-offers">${offerItem}</div>`;
}

function createEventPhotoElement(pictures) {
  return `${pictures.length ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>` : ''}`;
}

function createResetButtonTemplate(eventType, isDeleting, isDisabled) {
  let label;
  if (eventType === EditType.CREATING) {
    label = ButtonLabel.CANCEL_DEFAULT;
  } else {
    label = isDeleting ? ButtonLabel.DELETE_IN_PROGRESS : ButtonLabel.DELETE_DEFAULT;
  }
  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createEventEditElement({event, eventDestination, eventOffers, eventType}) {
  const { type, offers, dateFrom, dateTo, price, isDisabled, isSaving, isDeleting } = event;
  const currentOffers = eventOffers.find((offer) => offer.type === type);
  const currentDestination = eventDestination.find((destination) => destination.id === event.destination);
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
                ${createEventTypesListElement(eventOffers, type, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(nameDestination)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            ${createEventDestinationListElement(eventDestination)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? formatStringToDateTime(dateFrom) : ''}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? formatStringToDateTime(dateTo) : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(price))}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? ButtonLabel.SAVE_IN_PROGRESS : ButtonLabel.SAVE_DEFAULT}</button>
          ${createResetButtonTemplate(eventType, isDeleting, isDisabled)}
          ${(eventType === EditType.EDITING) ? '<button class="event__rollup-btn" type="button">' : ''}
        </header>
        <section class="event__details">
          ${(currentOffers.offers.length !== 0) ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            ${createEventOfferElement(currentOffers.offers, offers, isDisabled)}
          </section>` : ''}

          ${(currentDestination) ? `${(currentDestination.description.length || currentDestination.pictures.length) ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            ${createEventPhotoElement(currentDestination.pictures)}` : ''}
          </section>` : ''}
        </section>
      </form>
    </li>`;
}

export default class EditablePointView extends AbstractStatefulView {
  #eventDestination = null;
  #eventOffers = null;
  #handleEditSubmit = null;
  #handleEditReset = null;
  #handleRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #eventType;

  constructor({event = POINT_EMPTY, eventDestination, eventOffers, onEditSubmit, onEditReset, onRollupClick, eventType = EditType.EDITING}) {
    super();
    this.#eventDestination = eventDestination;
    this.#eventOffers = eventOffers;
    this.#handleEditSubmit = onEditSubmit;
    this.#handleEditReset = onEditReset;
    this.#handleRollupClick = onRollupClick;
    this.#eventType = eventType;

    this._setState(EditablePointView.parseEventToState(event));
    this._restoreHandlers();
  }

  get template() {
    return createEventEditElement({
      event: this._state,
      eventDestination: this.#eventDestination,
      eventOffers: this.#eventOffers,
      eventType: this.#eventType
    });
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

  reset(event) {
    this.updateElement(
      EditablePointView.parseEventToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#editSubmitHandler);
    if (this.#eventType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
      this.element.querySelector('.event--edit')
        .addEventListener('reset', this.#editResetHandler);
    }
    if (this.#eventType === EditType.CREATING) {
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

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate
    });

    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #editSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditSubmit(EditablePointView.parseStateToEvent(this._state));
  };

  #editResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditReset(EditablePointView.parseStateToEvent(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
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
    const selectedDestination = this.#eventDestination.find((destination) => destination.name === evt.target.value);
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

  static parseEventToState(event) {
    return {...event,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToEvent(state) {
    const event = {...state};
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  }
}
