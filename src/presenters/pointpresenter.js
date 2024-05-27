import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';
import { isEscapeKey } from '../utils.js';
import PointView from '../view/point.js';
import EditablePointView from '../view/modpoint.js';
import { UserAction, UpdateType } from '../const.js';
import { isBigDifference } from '../utils.js';

export default class PointPresenter {
  #pointListContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #onDataChange = null;
  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onRollupClick: this.#pointRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#pointEditComponent = new EditablePointView ({
      point: this.#point,
      pointDestination: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onEditSubmit: this.#editSubmitHandler,
      onEditReset: this.#editResetHandler,
      onRollupClick: this.#editorRollupClickHandler,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditorToPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #replacePointToEditor() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditorToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #pointRollupClickHandler = () => {
    this.#replacePointToEditor();
  };

  #favoriteClickHandler = () => {
    this.#onDataChange( UserAction.UPDATE_EVENT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #editorRollupClickHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditorToPoint();
  };

  #editSubmitHandler = (update) => {
    const isMinorUpdate = isBigDifference(update, this.#point);
    this.#onDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceEditorToPoint();
  };

  #editResetHandler = (event) => {
    this.#onDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditorToPoint();
    }
  };
}
