import { remove, render, RenderPosition } from '../framework/render.js';
import EditablePointView from '../view/modpoint.js';
import { UserAction, UpdateType, EditType, Method } from '../const.js';
import { isEscapeKey, } from '../utils.js';
import pointApiService from '../service/apiservice.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({pointListContainer, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditablePointView({
      pointDestination: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onEditSubmit: this.#handleEditSubmit,
      onEditReset: this.#handleResetClick,
      pointType: EditType.CREATING
    });

    render(this.#pointEditComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  #handleEditSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {id: crypto.randomUUID(), ...event},
    );
  };

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


  #handleResetClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  async addPoint(update) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(adaptToServer(update)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await pointApiService.parseResponse(response);
    return parsedResponse;
    }

  async deleteEvent(update) {
    const response = await this._load({
      url: `points/${update.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
