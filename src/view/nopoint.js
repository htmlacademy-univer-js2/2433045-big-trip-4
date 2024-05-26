import AbstractView from '../framework/view/abstract-view.js';
import { NoEventsTextType } from '../utils.js';

function createNoPointElement(filterType) {
  return `<p class="trip-events__msg">${NoEventsTextType[filterType]}</p>`;
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }
  get template() {
    return createNoPointElement(this.#filterType);
  }
}