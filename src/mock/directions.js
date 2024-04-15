import { getRandomValue, getRandomInteger } from '../utils';
import { CITIES, DESCRIPTION, DESTINATION_COUNT } from '../const';

function generateDestination() {
  return {
    id: crypto.randomUUID(),
    description: Array.from({length: getRandomInteger(1, 5)}, () => getRandomValue(DESCRIPTION)).join(' '),
    name: getRandomValue(CITIES),
    pictures: Array.from({length: getRandomInteger(1, 5)}, () => ({
      src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      description: getRandomArrayElement(DESCRIPTION)
    }))
  };
}
const mockDestinations = Array.from({length: DESTINATION_COUNT}, generateDestination);
export {mockDestinations};
