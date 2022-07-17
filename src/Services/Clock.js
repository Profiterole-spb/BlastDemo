import EventEmitter from './EventEmitter.js';

export default class Clock extends EventEmitter {
  constructor() {
    super();
    this._timestamp = 0;
    this._elapsed = 0;
    this._delta = 0;
    this._lastFrame = 0;
    this._isRunning = false;
  }

  get elapsed() {
    return this._elapsed;
  }

  get delta() {
    return this._delta;
  }

  run() {
    this._timestamp = Date.now();
    this._lastFrame = this._timestamp;
    this._isRunning = true;
    this._tick();
  }

  stop() {
    this._isRunning = false;
  }

  _tick() {
    const now = Date.now();
    this._elapsed = now - this._timestamp;
    this._delta = now - this._lastFrame;
    this._lastFrame = now;
    this.emit('tick', {elapsed: this._elapsed, delta: this._delta});
    if (!this._isRunning) return;
    requestAnimationFrame(() => this._tick());
  }
}
