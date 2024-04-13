import dayjs from 'dayjs';

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(array) {
  return array[0, getRandomInteger(0, array.length - 1)];
}

function formatDateToShortDate(date){
  return dayjs(date).format('MMM DD');
}

function formatDateToDateTime(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function formatDateToDateTimeHTML(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatDateToTime(date) {
  return dayjs(date).format('HH:mm');
}

function formatDuration(date1, date2){
  const duration = dayjs(date2).subtract(dayjs(date1));
  return `${duration.minute()}M`;
}

export { getRandomInteger, getRandomValue, formatDateToShortDate, formatDateToDateTimeHTML, formatDateToDateTime, formatDateToTime, formatDuration };
