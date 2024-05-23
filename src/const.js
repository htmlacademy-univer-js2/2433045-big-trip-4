const CITIES = ['Moscow','Saint Petersburg','Novosibirsk','Yekaterinburg','Kazan','Nizhny Novgorod','Chelyabinsk','Krasnoyarsk','Samara','Ufa'];
const DESCRIPTION = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];
const OFFERS_NAMES = ['Upgrade to a business class','Add luggage','Switch to comfort class','Add meal','Choose seats','Travel by train'];
const POINT_TYPES = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];
const EVENT_COUNT = 4;
const DESTINATION_COUNT = 3;
const DEFAULT_TYPE = 'flight';

const Price = {
  MAX: 10,
  MIN: 1000
};

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

const Duration = {
  HOUR: 5,
  DAY: 5,
  MIN: 59
};
export { Mode,FilterType, CITIES, DESCRIPTION, OFFERS_NAMES, POINT_TYPES,EVENT_COUNT, Price, POINT_EMPTY, DESTINATION_COUNT, Duration, MSEC_IN_HOUR, MSEC_IN_DAY};
