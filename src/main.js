import TripEventsPresenter from './presenter/trippresenter.js';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers';
import PointsModel from './model/points';
import MockService from './service/mockservice.js';
import FilterView from './view/filter.js';
import { render } from './framework/render.js';

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const mockService = new MockService();

const tripEventsPresenter = new TripEventsPresenter({
    container: tripEventsContainer,
    destinationsModel,
    offersModel,
    pointsModel
  });

render(new FilterView(), filterContainer);
tripEventsPresenter.init();
