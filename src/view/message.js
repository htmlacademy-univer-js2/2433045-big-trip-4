import AbstractView from '../framework/view/abstract-view.js';
import { NoEventsTextType } from '../utils/filter.js';

function createMessageElement(filterType) {
  return `<p class="trip-events__msg">${NoEventsTextType[filterType]}</p>`;
}

export default class MessageView extends AbstractView {
  #filterType = null;
  #isLoading = false;
  #isLoadingError = false;

  constructor({filterType, isLoading = false, isLoadingError = false}) {
    super();
    this.#filterType = filterType;
    this.#isLoading = isLoading;
    this.#isLoadingError = isLoadingError;
  }

  get template() {
    if (this.#isLoading) {
      return '<p class="trip-events__msg">Loading...</p>';
    }

    if (this.#isLoadingError) {
      return '<p class="trip-events__msg">Failed to load latest route information</p>';
    }
    return createMessageElement(this.#filterType);
  }
}
