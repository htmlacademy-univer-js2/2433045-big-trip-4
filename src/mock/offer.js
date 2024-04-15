import { getRandomInteger, getRandomValue } from '../utils';
import { OFFERS_NAMES, POINT_TYPES,Price } from '../const';

const mockOffer = [];

function generateOffer(type) {
  return {
    type,
    offers: Array.from({length: getRandomInteger(0, 5)}, () => ({
      id: crypto.randomUUID(),
      title: getRandomValue(OFFERS_NAMES),
      price:getRandomInteger(Price.MIN, Price.MAX)
    }))
  };
}

POINT_TYPES.forEach((type) => {
  const offer = generateOffer(type);
  mockOffer.push(offer);
});

export {mockOffer};
