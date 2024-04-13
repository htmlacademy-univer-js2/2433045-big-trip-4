import { POINT_TYPES } from '../mock/const';
import { generateOffersByType } from '../mock/offer';

export default class OffersModel {

  constructor() {
    this.offers = POINT_TYPES.map((type) => generateOffersByType(type));
  }

  get() {
    return this.offers;
  }

  getByType(type) {
    return this.offers.find((offersList) => offersList.type === type);
  }

  getById(type, id) {
    return this.getByType(type).offers.find((offer) => offer.if === id);
  }

}
