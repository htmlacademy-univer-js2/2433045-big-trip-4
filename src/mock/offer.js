import { getRandomInteger, getRandomValue } from '../utils';
import { OFFERS_NAMES, POINT_TYPES,Price } from '../const';

const mockOffer=[]
function generateOffersByType(type) {
  return {
    type: type,
    offers: Array.from({ length: getRandomInteger(1, 5)}, () =>({
      id: crypto.randomUUID(),
      title: getRandomValue(OFFERS_NAMES),
      price: getRandomInteger(Price.MIN, Price.MAX)
    }))
  };
}
POINT_TYPES.forEach((type) => {
  const offer = generateOffersByType(type);
  mockOffer.push(offer);
});


export { mockOffer };
