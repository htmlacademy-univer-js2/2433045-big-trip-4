import { render } from '../render';
import SortView from '../view/sort.js';
import PointListView from '../view/list.js';
import PointView from '../view/point.js';
import EditablePointView from '../view/modpoint.js';

export default class BoardPresenter {
  constructor({ container, destinationsModel, offersModel, pointsModel }) {
    this.container = container;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
  }

  init() {
    render(new SortView(), this.container);
    const eventList = new PointListView();
    render(eventList, this.container);
    const points = [...this.pointsModel.get()];
    render(new EditablePointView({
      point: points[0],
      pointDestination: this.destinationsModel.getById(points[0].destination),
      pointOffers: this.offersModel.getByType(points[0].type)
    }), eventList.getElement());

    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const pointDestination = this.destinationsModel.getById(point.destination);
      const pointOffers = this.offersModel.getByType(point.type);
      const pointView = new PointView({ point, pointDestination, pointOffers });
      render(pointView, eventList.getElement());
    }
  }
}
