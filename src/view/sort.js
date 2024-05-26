import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';
import { firstLetterToUpperCase } from '../utils.js';

function createSortItemElement(currentSortType) {
  return Object.values(SortType).map((type) =>
    `<div class="trip-sort__item  trip-sort__item--${type}" >
  <input id="sort-${type}" class="trip-sort__input  visually-hidden" data-sort-type="${type}" type="radio" name="trip-sort" value="sort-${type}" ${currentSortType === type ? 'checked' : ''} ${type === 'event' || type === 'offer' ? 'disabled' : ''}>
  <label class="trip-sort__btn" for="sort-${type}">${firstLetterToUpperCase(type)}</label>
  </div>`).join('');
}

function createSortElement(currentSortType) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get"> ${createSortItemElement(currentSortType)}
    </form>`;
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #onSortTypeChange = null;
  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {return createSortElement(this.#currentSortType);}

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}