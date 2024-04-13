import { render } from './render.js';
import FilterView from './view/filter.js';
import TripEventsPresenter from './presenter/trippresenter.js';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers';
import PointsModel from './model/points';


const tripControlsFilters = document.querySelector('.trip-controls__filters');
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel(destinationsModel, offersModel);
const tripEventsPresenter = new TripEventsPresenter({
    container: boardContainer,
    destinationsModel,
    offersModel,
    pointsModel
  });

render(new FilterView(), tripControlsFilters);

tripEventsPresenter.init();
filterPresenter.init();
