export default class OffersModel {
  #apiService = null;
  #offers = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  async init() {
    this.#offers = await this.#apiService.offers;
    return this.#offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
