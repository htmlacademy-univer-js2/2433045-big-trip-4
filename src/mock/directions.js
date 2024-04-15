import { getRandomValue, getRandomInteger } from '../utils';
import { CITIES, DESCRIPTION, DESTINATION_COUNT } from '../const';

function generateDestination() {
  const city = getRandomValue(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: Array.from({length: getRandomInteger(1, 5)}, () => getRandomArrayElement(DESCRIPTION)).join(' '),
    pictures: Array.from({length: getRandomInteger(1, 5)}, () => ({
      src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      description: getRandomArrayElement(DESCRIPTION)
    }))
  };
}
const mockDestinations = Array.from({length: DESTINATION_COUNT}, generateDestination);

export { mockDestinations };
