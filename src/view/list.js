import AbstractView from '../framework/view/abstract-view';

function createEventListViewTemplate() {
  return /* html */ `
    <ul class="trip-events__list"></ul>
  `;
}

export default class PointListView extends AbstractView {
  getTemplate() {
    return createEventListViewTemplate();
  }
}
