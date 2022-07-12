export default class EventEmitter {

  constructor() {
    this._events = {}
  }

  eventNames() {
    return Object.keys(this._events);
  }

  listeners(eventName) {
    return this._events[eventName]
  }

  listenerCount(eventName) {
    if (!this._events[eventName]) return -1;
    return this._events[eventName].length
  }

  once(eventName, fn, context) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push({fn, context, once: true})
  }

  addEventListener(eventName, fn, context) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push({fn, context: context || this, once: false});
  }

  removeEventListener(eventName, fn, context) {
    if (!this._events[eventName]) return;
    const ctx = context || this;
    const index = this._events[eventName].findIndex(emitter => emitter.fn === fn && emitter.context === ctx);
    if (index >= 0) delete this._events[eventName][index];
  }

  removeAllListeners(eventName) {
    if (this._events[eventName]) {
      delete this._events[eventName]
    }
  }

  emit(eventName, data) {
    if (!this._events[eventName]) return;
    this._events[eventName].forEach(emitter => {
      emitter.fn.call(emitter.context, data)
    })
  }
}
