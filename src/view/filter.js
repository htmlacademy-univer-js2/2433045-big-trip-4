import AbstractView from '../framework/view/abstract-view.js';
import { firstLetterToUpperCase } from '../presenters/utils.js';

function createFilterItemElement(filter, currentFilter) {
  const {type, exists} = filter;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${currentFilter === type ? 'checked' : ''} ${exists ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${type}">${firstLetterToUpperCase(type)}</label>
    </div>`;
}

function createFilterElement(filterItems, currentFilter) {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemElement(filter, currentFilter)).join('');
  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterElement(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
