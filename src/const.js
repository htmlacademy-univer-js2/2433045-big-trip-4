const TYPES = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];
const DEFAULT_TYPE = 'flight';
const DESTINATION_ITEMS_LENGTH = 3;

const POINT_EMPTY = {
  type: DEFAULT_TYPE,
  price: 0,
  dateFrom: null,
  dateTo: null,
  isFavorite: false,
  destination: null,
  offers: []
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const ButtonLabel = {
  CANCEL_DEFAULT: 'Cancel',
  DELETE_DEFAULT: 'Delete',
  SAVE_DEFAULT: 'Save',
  SAVE_IN_PROGRESS: 'Saving...',
  DELETE_IN_PROGRESS: 'Deleting...',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
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

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

export {
  TimeLimit,
  Method,
  EditType,
  ButtonLabel,
  UserAction,
  UpdateType,
  Mode,
  FilterType,
  TYPES,
  POINT_EMPTY,
  MSEC_IN_HOUR,
  MSEC_IN_DAY, DESTINATION_ITEMS_LENGTH, SortType};
