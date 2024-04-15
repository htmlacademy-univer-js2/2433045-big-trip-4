import { getRandomInteger, getDate } from '../utils';
import { Price } from '../const.js';

function generatePoint(type, offersID, destinationID) {
  return {
    id: crypto.randomUUID(),
    type,
    price: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    isFavorite: getRandomInteger(0, 1),
    destination: destinationID,
    offers: offersID
  };
}

export { generatePoint };
