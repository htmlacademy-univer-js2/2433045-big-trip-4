export default class DestinationsModel {
  #apiService = null;
  #destinations = null;

  constructor(eventsApiService) {
    this.#apiService = pointApiService;
  }

  async init() {
    this.#destinations = await this.#apiService.destinations;
    return this.#destinations;
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
