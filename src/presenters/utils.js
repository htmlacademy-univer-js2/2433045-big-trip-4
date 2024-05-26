import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MSEC_IN_HOUR, MSEC_IN_DAY, FilterType } from './const';

dayjs.extend(duration);
dayjs.extend(relativeTime);


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

function isBigDifference(event1, event2) {
  return event1.price !== event2.price
    || getEventDuration(event1.dateFrom, event1.dateTo) !== getEventDuration(event2.dateFrom, event2.dateTo);
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

const isEscapeKey = (evt) => evt.key === 'Escape';
const formatStringToDateTime = (dateF) => dayjs(dateF).format('DD/MM/YY HH:mm');
const formatStringToShortDate = (dateF) => dayjs(dateF).format('MMM DD');
const formatStringToTime = (dateF) => dayjs(dateF).format('HH:mm');

const getPointDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDiff >= MSEC_IN_DAY) {
    return dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= MSEC_IN_HOUR) {
    return dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }
  return dayjs.duration(timeDiff).format('mm[M]');
};

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

export {
  isEventPast,
  isEventPresent,
  isEventFuture,
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  getPointDuration,
  firstLetterToUpperCase,
  firstLetterToLowerCase,
  updateItem,
  isEscapeKey,
  sortByTime,
  sortByPrice,
  isBigDifference,
  filter,
  NoEventsTextType,
  adaptToClient,
  adaptToServer};
