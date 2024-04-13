import { generateDestination } from '../mock/directions';

const DESTINATION_COUNT = 5;

export default class DestinationsModel {

  constructor() {
    this.destinations = Array.from({ length: DESTINATION_COUNT }, generateDestination);
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

}
