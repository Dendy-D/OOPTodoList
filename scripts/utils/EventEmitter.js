class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  emit(event, ...args) {
    this.events[event]?.forEach((listener) => listener(...args));
    return this;
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((oldListener) => listener !== oldListener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    }
    this.on(event, wrapper);
    return this;
  }

  getAllListeners(event) {
    return this.events[event] ?? [];
  }

  removeAll(event) {
    if (!this.events[event]) return;
    delete this.events[event];
    return this;
  }
}

export default new EventEmitter();
