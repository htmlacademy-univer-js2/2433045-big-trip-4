import { mockDestinations } from '../mock/directions.js';
import { mockOffer } from '../mock/offers.js';
import { generatePoint } from '../mock/point.js';
import { EVENT_COUNT, POINT_TYPES } from '../const.js';
import { getRandomValue, getRandomInteger } from '../utils.js';

export default class MockService {
    #destinations = null;
    #offers = null;
    #points = null;
  constructor() {
    this.#destinations = mockDestinations;
    this.#offers = mockOffer;
    this.#points = this.#generatePoints();
  }

  #generatePoints() {
    return Array.from({length: EVENT_COUNT}, () => {
      const type = getRandomValue(POINT_TYPES);
      const destination = getRandomValue(this.#destinations);
      const destinationIDs = destination.id;
      const offersByType = this.#offers.find((offerByType) => offerByType.type === type);
      const offersIDs = [];
      offersByType.offers.forEach((offer) => {
        if (getRandomInteger(0, 1)) {
          offersIDs.push(offer.id);
        }
      });
      return generatePoint(type, offersIDs, destinationIDs);
    });
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getEvents() {
    return this.#points;
  }
}
