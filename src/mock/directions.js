import { getRandomValue, getRandomInteger } from '../utils';
import { CITIES, DESCRIPTION } from './const';


function generateDestination() {
  const city = getRandomValue(CITIES);
  const maxPictures = 5;

  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTION,
    pictures: Array.from({ length: getRandomInteger(0, maxPictures) }, generatePicture),
  };

  function generatePicture() {
    return {
      'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      'description': `${city} description`
    };
  }
}

export { generateDestination };
