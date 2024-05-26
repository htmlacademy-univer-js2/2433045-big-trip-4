import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import PointPresenter from './pointpresenter.js';
import NewPointPresenter from './newpointpresenter.js';
import MessageView from '../view/message.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { sortByTime, sortByPrice, filter } from '../utils.js';

export default class TripPointsPresenter {
  #listComponent = new ListView();
  #sortComponent = null;
  #noPointComponent = null;
  #tripContainer = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isLoadingError = false;

  constructor({tripContainer, destinationsModel, offersModel, pointsModel,filterModel, onNewPointDestroy}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#tripContainer = tripContainer;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#filterModel.addObserver(this.#handleModelPoint);
    this.#pointsModel.addObserver(this.#handleModelPoint);
  };

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.get();
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  };

  init() {
    this.#renderTrip();
  };

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  };

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderMessage({isLoading: true});
      return;
    }

    if (this.#isLoadingError) {
      this.#renderMessage({isLoadingError: true});
      return;
    }

    if (this.points.length === 0) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #renderPointContainer() {
    render(this.#listComponent, this.#tripContainer);
  };

  #clearTrip({ resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderMessage({isLoading = false, isLoadingError = false} = {}) {
    this.#noPointComponent = new MessageView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError
    });

    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#pointsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#pointsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#pointsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;

      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;

      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointtListContainer: this.#listComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
};
