import TripPointsPresenter from './presenters/trippresenter.js';
import FilterPresenter from './presenters/filterpresenter.js';
import DestinationsModel from './models/destinations.js';
import NewPointButtonView from './view/newpoint.js';
import OffersModel from './models/offers.js';
import PointsModel from './models/points.js';
import pointApiService from './service/apiservice.js';
import FilterModel from './models/filters.js';
import { render, RenderPosition } from './framework/render.js';

const AUTHORIZATION = 'Basic dd89j3m2h10l';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripMainContainer = document.querySelector('.trip-main');
const tripContainer = document.querySelector('.trip-events');
const filterModel = new FilterModel();
const eventapiService = new pointApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationsModel( eventapiService);
const offersModel = new OffersModel( eventapiService);
const pointsModel = new PointsModel( {
  eventapiService,
  destinationsModel,
  offersModel});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointClick() {
  newPointButtonComponent.element.disabled = true;
}

const routePresenter = new TripPointsPresenter({
  tripInfoContainer: tripMainContainer,
  tripContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
  onNewPointClick: handleNewPointClick,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  routePresenter.createEvent();
  handleNewPointClick();
}

render(newPointButtonComponent, tripMainContainer, RenderPosition.BEFOREEND);
filterPresenter.init();
routePresenter.init();
pointsModel.init();
