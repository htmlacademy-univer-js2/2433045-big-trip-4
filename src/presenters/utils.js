import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Duration, MSEC_IN_HOUR, MSEC_IN_DAY } from './const';

dayjs.extend(duration);
dayjs.extend(relativeTime);
let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

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

function getRandomInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

function getRandomValue(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function firstLetterToUpperCase(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function firstLetterToLowerCase(type) {
  return type.toLowerCase();
}

function getDate({ next }) {
  const minsGap = getRandomInteger(0, Duration.MIN);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return date;
}

function isBigDifference(event1, event2) {
  return event1.price !== event2.price
    || getEventDuration(event1.dateFrom, event1.dateTo) !== getEventDuration(event2.dateFrom, event2.dateTo);
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
  getRandomInteger,
  getRandomValue,
  getDate,
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
  NoEventsTextType};