import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';
import PointView from '../view/point.js';
import EditablePointView  from '../view/modpoint.js';

export default class PointPresenter {
  #eventListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #onDataChange = null;
  #event = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({eventListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(event) {
    this.#event = event;
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;
    this.#eventComponent = new PointView({
      event: this.#event,
      eventDestination: this.#destinationsModel.getById(event.destination),
      eventOffers: this.#offersModel.getByType(event.type),
      onRollupClick: this.#eventRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#eventEditComponent = new EditablePointView ({
      event: this.#event,
      eventDestination: this.#destinationsModel.get(),
      eventOffers: this.#offersModel.get(),
      onEditSubmit: this.#editSubmitHandler,
      onRollupClick: this.#editorRollupClickHandler,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }
  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceEditorToEvent();
    }
  }

  #replaceEventToEditor() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditorToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #eventRollupClickHandler = () => {
    this.#replaceEventToEditor();
  };

  #favoriteClickHandler = () => {
    this.#onDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #editorRollupClickHandler = () => {
    this.#eventEditComponent.reset(this.#event);
    this.#replaceEditorToEvent();
  };

  #editSubmitHandler = (event) => {
    this.#replaceEditorToEvent();
    this.#onDataChange(event);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#replaceEditorToEvent();
    }
  };
}
