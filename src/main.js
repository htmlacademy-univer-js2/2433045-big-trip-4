import TripPointsPresenter from './presenter/trippresenter.js';
import FilterPresenter from './presenter/filterpresenter.js';
import DestinationsModel from './model/destinations-model';
import NewPointButtonView from './view/newpoint.js';
import OffersModel from './model/offers';
import PointsModel from './model/points';
import pointApiService from './service/apiservice.js';
import FilterModel from './model/filters.js';
import { render, RenderPosition } from './framework/render.js';

const AUTHORIZATION = 'Basic dd89j3m2h10l';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';
const apiService = new pointApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel( apiService);
const offersModel = new OffersModel( apiService);
const pointsModel = new PointsModel( apiService, offersModel, destinationsModel);
const filterModel = new FilterModel();

const filterContainer = document.querySelector('.trip-controls__filters');
const tripMainContainer = document.querySelector('.trip-main');
const tripContainer = document.querySelector('.trip-events');

const routePresenter = new TripPointsPresenter({
  tripInfoContainer: tripMainContainer,
  tripContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
  onNewPointClick: handleNewPointButtonClick,
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
  routePresenter.createEvent();
  handleNewPointButtonClick();
}

render(newPointButtonComponent, tripMainContainer, RenderPosition.BEFOREEND);
filterPresenter.init();
routePresenter.init();
pointsModel.init();
