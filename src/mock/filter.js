import { FilterType } from '../const';
import { isEventFuture, isEventPresent, isEventPast } from '../utils';

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event)),
};

function generateFilters(events) {
  return Object.entries(filter).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      exists: filterEvents(events).length > 0
    })
  );
}

export {generateFilters};