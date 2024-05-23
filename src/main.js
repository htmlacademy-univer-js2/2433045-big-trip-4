import TripEventsPresenter from './presenter/trippresenter.js';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers';
import PointsModel from './model/points';
import MockService from './service/mockservice.js';
import FilterView from './view/filter.js';
import { generateFilters } from './mock/filter.js';
import { render } from './framework/render.js';

const destinationsModel = new DestinationsModel();
const mockService = new MockService();
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filters = generateFilters(pointsModel.get());
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsPresenter = new TripEventsPresenter({
  tripContainer: tripEventsContainer,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new FilterView({filters}), filterContainer);
tripEventsPresenter.init();
