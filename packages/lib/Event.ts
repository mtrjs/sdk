class Event {
  event: Map<string, any>;
  maxListener: number;
  constructor() {
    this.event = new Map();
    this.maxListener = 100;
  }
  on(type: string, fn: Function) {
    const list = this.event.get(type) || [];
    if (typeof fn === 'function') {
      this.event.set(type, [...list, fn]);
    }
  }

  once(type: string, fn: Function) {
    const _this = this;
    function newFn(...args: any[]) {
      fn(...args);
      _this.removeListener(type, newFn);
    }
    this.on(type, newFn);
  }

  emit<T>(type: string, params: T) {
    const listeners = this.event.get(type) || [];
    listeners.forEach((fn: Function) => fn(params));
  }

  setMaxListeners(count: number) {
    this.maxListener = count;
  }

  listeners(type: string) {
    return this.event.get(type) || [];
  }

  removeAllListener(type: string) {
    this.event.set(type, []);
  }
  removeListener(type: string, listener: Function) {
    let listeners = this.event.get(type) || [];
    listeners = listeners.filter((fn: Function) => listener !== fn);
    this.event.set(type, listeners);
  }
}

export default Event;
