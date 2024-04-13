import DestinationsModel from './models/directions';
import OffersModel from './models/offers';
import PointsModel from './models/points';
import BoardPresenter from './presenters/boardpresenter';
import FilterPresenter from './presenters/filterpresenter';

const filterContainer = document.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel(destinationsModel, offersModel);
const filterPresenter = new FilterPresenter({container: filterContainer});
const boardPresenter = new BoardPresenter({
  container: boardContainer,
  destinationsModel,
  offersModel,
  pointsModel
});

filterPresenter.init();
boardPresenter.init();
