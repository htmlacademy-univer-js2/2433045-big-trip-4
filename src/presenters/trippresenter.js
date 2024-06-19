import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PointPresenter from './pointpresenter.js';
import NewPointPresenter from './newpointpresenter.js';
import MessageView from '../view/message.js';
import TripInfoPresenter from './tripinfopresenter.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit} from '../const.js';
import { sort, filter } from './utils.js';

export default class TripPointsPresenter {
  #eventListComponent = new ListView();
  #sortComponent = null;
  #noEventComponent = null;

  #tripInfoContainer = null;
  #tripEventsContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #filterModel = null;
  #handleNewEventClick = null;
  #handleNewEventDestroy = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;
  #tripInfoPresenter = null;
  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #isLoadingError = false;
  #isCreating = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripInfoContainer, tripEventsContainer, destinationsModel, offersModel, eventsModel, filterModel, onNewEventDestroy, onNewEventClick}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#handleNewEventClick = onNewEventClick;
    this.#handleNewEventDestroy = onNewEventDestroy;

    this.#newEventPresenter = new NewPointPresenter({
      eventListContainer: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.get();
    const filteredEvents = filter[this.#filterType](events);

    return sort[this.#currentSortType](filteredEvents);
  }

  get eventsEverything() {
    this.#filterType = FilterType.EVERYTHING;
    const events = this.#eventsModel.get();
    const filteredEvents = filter[this.#filterType](events);

    return sort[this.#currentSortType](filteredEvents);
  }

  init() {
    this.#renderTrip();
  }

  createEvent() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
    this.#isCreating = false;
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderMessage({isLoading: true});
      this.#handleNewEventClick();
      return;
    }

    if (this.#isLoadingError) {
      this.#renderMessage({isLoadingError: true});
      return;
    }

    if (this.events.length === 0 && !this.#isCreating) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderEventContainer();
    this.#renderEvents();
  }

  #renderEventContainer() {
    render(this.#eventListComponent, this.#tripEventsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderMessage({isLoading = false, isLoadingError = false} = {}) {
    this.#noEventComponent = new MessageView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError,
    });

    render(this.#noEventComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter({
      tripInfoContainer: this.#tripInfoContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    const sortedEvents = sort[SortType.DAY](this.eventsEverything);
    this.#tripInfoPresenter.init(sortedEvents);
  };

  #renderEvents() {
    this.events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new PointPresenter({
      eventListContainer: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
  };

  #clearTrip({ resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        this.#clearTripInfo();
        this.#renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        this.#handleNewEventDestroy();
        this.#clearTrip();
        this.#renderTrip();
        this.#renderTripInfo();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
