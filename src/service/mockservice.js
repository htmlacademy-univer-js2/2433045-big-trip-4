import { mockDestinations } from '../mock/directions.js';
import { mockOffer } from '../mock/offer.js';
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
    this.#points = this.#generatePoints();}

  #generatePoints() {
    return Array.from({length: EVENT_COUNT}, () => {
      const type = getRandomValue(POINT_TYPES);
      const destinationIDs = (getRandomInteger(0, 1)) ? getRandomValue(this.#destinations).id : null;
      const offersByType = this.#offers.find((offerByType) => offerByType.type === type);
      const offersIDs = [];
      offersByType.offers.forEach((offer) => {
        if (getRandomInteger(0, 1)) {
          offersIDs.push(offer.id);}
        });
      return generatePoint(type, offersIDs, destinationIDs);
    });
  }
  get destinations() {return this.#destinations;}
  get offers() {return this.#offers;}
  get points() {return this.#points;}
}