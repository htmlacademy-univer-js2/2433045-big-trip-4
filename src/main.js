import TripPointsPresenter from './presenter/trippresenter.js';
import FilterPresenter from './presenter/filterpresenter.js';
import DestinationsModel from './model/destinations-model';
import NewPointButtonView from './view/newpoint.js';
import OffersModel from './model/offers';
import PointsModel from './model/points';
import MockService from './service/mockservice.js';
import FilterModel from './model/filters.js';
import { render, RenderPosition } from './framework/render.js';
import TripInfoView from './view/tripinfo.js';

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterModel = new FilterModel();
const filterContainer = document.querySelector('.trip-controls__filters');
const tripMainContainer = document.querySelector('.trip-main');
const tripContainer = document.querySelector('.trip-events');

const routePresenter = new TripPointsPresenter({
  tripContainer: tripContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  routePresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
render(newPointButtonComponent, tripMainContainer, RenderPosition.BEFOREEND);

routePresenter.init();
filterPresenter.init();