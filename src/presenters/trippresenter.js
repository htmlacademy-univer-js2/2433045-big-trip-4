import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PointPresenter from './pointpresenter.js';
import NewPointPresenter from './newpointpresenter.js';
import MessageView from '../view/message.js';
import TripInfoPresenter from './tripinfopresenter.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit} from '../const.js';
import { sort, filter } from '../utils.js';

export default class TripPointsPresenter {
  #listComponent = new ListView();
  #sortComponent = null;
  #noPointComponent = null;

  #tripContainer = null;
  #tripInfoContainer = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #handleNewPointClick = null;
  #handleNewPointDestroy = null;

  #tripInfoPresenter = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isLoadingError = false;
  #isCreating = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripInfoContainer, tripContainer, destinationsModel, offersModel, pointsModel,filterModel, onNewPointDestroy, onNewPointClick}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#handleNewPointClick = onNewPointClick;
    this.#handleNewPointDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#filterModel.addObserver(this.#handleModelPoint);
    this.#pointsModel.addObserver(this.#handleModelPoint);
  }

  get points() {
    this.#filterType = FilterType.EVERYTHING;
    const points = this.#pointsModel.get();
    const filteredPoints = filter[this.#filterType](points);

    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderTrip();
  }

  createPoint() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    this.#isCreating = false;
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderMessage({isLoading: true});
      this.#handleNewPointClick();
      return;
    }

    if (this.#isLoadingError) {
      this.#renderMessage({isLoadingError: true});
      return;
    }

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  }

  #renderPointContainer() {
    render(this.#listComponent, this.#tripContainer);
  }

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
  }

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
  }

  #renderMessage({isLoading = false, isLoadingError = false} = {}) {
    this.#noPointComponent = new MessageView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError
    });

    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updateEvent(updateType, update);
        }
        catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_EVENT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addEvent(updateType, update);
        }
        catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deleteEvent(updateType, update);
        }
        catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        };
        break;
    }
    this.#uiBlocker.unblock();
  };

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter({
      tripInfoContainer: this.#tripInfoContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    const sortedPoints = sort[SortType.DAY](this.points);
    this.#tripInfoPresenter.init(sortedPoints);
  };

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this.#clearTripInfo();
        this.#renderTripInfo();
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
        this.#handleNewPointDestroy();
        this.#clearTrip();
        this.#renderTrip();
        this.#renderTripInfo();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

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
}
