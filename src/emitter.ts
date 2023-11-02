import EventEmitter from 'eventemitter3';

class EventManager {
  eventEmitter: EventEmitter<string | symbol, any>;
  listeners: string[];
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.listeners = [];
  }

  registerEvent(event) {
    this.listeners.push(event);
  }

  on(event, listener) {
    this.eventEmitter.on(event, listener);
  }

  off(event, listener) {
    this.eventEmitter.off(event, listener);
  }

  emit(event, data) {
    this.eventEmitter.emit(event, data);
  }

  listenToAll(callback) {
    this.listeners.forEach((listener) => {
      this.eventEmitter.on(listener, (data) => {
        callback({ ...data, eventName: listener });
      });
    });
  }

  emitToEvent(eventName, data) {
    this.eventEmitter.emit(eventName, data);
  }

  dispose() {
    this.eventEmitter.removeAllListeners();
  }
}

export default EventManager;
