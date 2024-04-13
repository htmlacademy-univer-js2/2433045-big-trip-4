import { render } from '../render';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new FilterView(), this.container);
  }
}
