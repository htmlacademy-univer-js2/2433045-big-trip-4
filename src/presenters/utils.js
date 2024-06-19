import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MSEC_IN_HOUR, MSEC_IN_DAY, FilterType, SortType, DESTINATION_ITEMS_LENGTH } from '../const.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const isEscapeKey = (evt) => evt.key === 'Escape';
const formatStringToDateTime = (dateF) => dayjs(dateF).format('DD/MM/YY HH:mm');
const formatStringToShortDate = (dateF) => dayjs(dateF).format('MMM DD');
const formatStringToTime = (dateF) => dayjs(dateF).format('HH:mm');

const sortByTime = (event1, event2) => {
  const time1 = dayjs(event1.dateTo).diff(dayjs(event1.dateFrom));
  const time2 = dayjs(event2.dateTo).diff(dayjs(event2.dateFrom));
  return time2 - time1;
};

const sortByPrice = (event1, event2) => event2.price - event1.price;

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event)),
};

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function isEventFuture(event) {
  return dayjs().isBefore(event.dateFrom);
}

function isEventPresent(event) {
  return dayjs().isAfter(event.dateFrom) && dayjs().isBefore(event.dateTo);
}

function isEventPast(event) {
  return dayjs().isAfter(event.dateTo);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function firstLetterToUpperCase(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function firstLetterToLowerCase(type) {
  return type.toLowerCase();
}

const getPointDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDiff >= MSEC_IN_DAY) {
    return dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= MSEC_IN_HOUR) {
    return dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }
  return dayjs.duration(timeDiff).format('mm[M]');
};

function isBigDifference(event1, event2) {
  return event1.price !== event2.price
    || getPointDuration(event1.dateFrom, event1.dateTo) !== getPointDuration(event2.dateFrom, event2.dateTo);
}

function sortByDay(event1, event2) {
  return new Date(event1.dateFrom) - new Date(event2.dateFrom);
}

function adaptToClient(event) {
  const adaptedEvent = {
    ...event,
    price: event['base_price'],
    dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
    dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
    isFavorite: event['is_favorite']
  };

  delete adaptedEvent['base_price'];
  delete adaptedEvent['date_from'];
  delete adaptedEvent['date_to'];
  delete adaptedEvent['is_favorite'];

  return adaptedEvent;
}

function adaptToServer(event) {
  const adaptedEvent = {
    ...event,
    ['base_price']: Number(event.price),
    ['date_from']: event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
    ['date_to']: event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
    ['is_favorite']: event.isFavorite
  };

  delete adaptedEvent.price;
  delete adaptedEvent.dateFrom;
  delete adaptedEvent.dateTo;
  delete adaptedEvent.isFavorite;

  return adaptedEvent;
}

const sort = {
  [SortType.DAY]: (points) => points.sort(sortByDay),
  [SortType.PRICE]: (points) => points.sort(sortByPrice),
  [SortType.TIME]: (points) => points.sort(sortByTime),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

function getTripTitle(events = [], destinations = []) {
  const destinationNames = sort[SortType.DAY]([...events])
    .map((event) => destinations.find((destination) => destination.id === event.destination).name);

  return destinationNames.length <= DESTINATION_ITEMS_LENGTH
    ? destinationNames.join('&nbsp;&mdash;&nbsp;')
    : `${destinationNames.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames.at(-1)}`;
}

function getTripDuration(events = []) {
  const sortedEvents = sort[SortType.DAY]([...events]);

  return (sortedEvents.length > 0)
    ? `${dayjs(sortedEvents.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(sortedEvents.at(-1).dateTo).format('DD MMM')}`
    : '';
}

function getOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),
    0
  );
}

function getTripCost(events = [], offers = []) {
  return events.reduce(
    (result, event) => result + event.price + getOffersCost(event.offers, offers.find((offer) => event.type === offer.type)?.offers),
    0
  );
}

export {
  adaptToClient,
  adaptToServer,
  firstLetterToUpperCase,
  firstLetterToLowerCase,
  updateItem,
  isEscapeKey,
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  getPointDuration,
  sortByDay,
  sortByTime,
  sortByPrice,
  isBigDifference,
  filter,
  NoEventsTextType,
  sort,
  getTripTitle,
  getTripDuration,
  getTripCost
};
