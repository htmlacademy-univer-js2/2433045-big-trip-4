import { getRandomInteger } from '../utils';
import dayjs from 'dayjs';

function generatePoint(destinationId, type, offerIds) {
  const maxBasePrice = 100;
  const dateFrom = getRandomInteger() ? generateDate(new Date()) : generateDate();
  const dateTo = generateDate(dateFrom);

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(10, maxBasePrice),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: destinationId,
    isFavorite: Boolean(getRandomInteger()),
    offers: offerIds,
    type: type
  };
}

function generateDate(after) {
  const minsGap = getRandomInteger(0, 30);
  const hoursGap = getRandomInteger(0, 6);
  const dayGap = getRandomInteger(0, 5);

  if (!after) {
    return dayjs().subtract(getRandomInteger(0, 10), 'day').toDate();
  }

  return dayjs(after)
    .add(minsGap, 'minute')
    .add(hoursGap, 'hour')
    .add(dayGap, 'day')
    .toDate();
}

export { generatePoint };
