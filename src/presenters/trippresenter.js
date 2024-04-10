import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import NewPointView from '../view/newpoint.js';
import EditablePointView from '../view/modpoint.js';
import PointView from '../view/point.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  listComponent = new ListView();
  constructor({tpipEventsContainer}) {
    this.tpipEventsContainer = tpipEventsContainer;
  }

  init() {
    render(new SortView(), this.tpipEventsContainer);
    render(this.listComponent, this.tpipEventsContainer);
    render(new EditablePointView, this.listComponent.getElement());
    render(new NewPointView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
