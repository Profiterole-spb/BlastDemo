import Clock from "./Clock.js";
import EventEmitter from "./EventEmitter.js";
import {Container} from "pixi.js";

export default class Locator {
  static _services = {
      clock: new Clock(),
      canvas: document.createElement('canvas'),
      eventEmitter: new EventEmitter(),
      stage: new Container()
    }

  /**
   * Returns a services list
   * @return {string[]}
   */
  static services() {
    return Object.keys(this._services);
  }

  static provideClock(clock) {
    this._services.clock = clock;
  }

  static getClock() {
    return this._services.clock
  }

  static provideCanvas(canvas) {
    this._services.canvas = canvas;
  }

  static getCanvas() {
    return this._services.canvas;
  }

  static provideRenderer(renderer) {
    this._services.renderer = renderer;
  }

  static getRenderer() {
    return this._services.renderer;
  }

  static provideStage(stage) {
    this._services.stage = stage;
  }

  static getStage() {
    return this._services.stage
  }

  static provideEventEmitter(eventEmitter) {
    this._services.eventBus = eventEmitter;
  }

  static getEventEmitter() {
    return this._services.eventBus
  }
}
