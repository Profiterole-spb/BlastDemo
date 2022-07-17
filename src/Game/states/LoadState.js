import EventEmitter from '../../Services/EventEmitter.js';
import Locator from '../../Services/Locator.js';
import {resources} from '../resources.js';
import {Events} from '../../Events/Events.js';

export default class LoadState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus()
        .addEventListener(Events.LoadStateIsInitialized, this.init, this);
  }

  init() {
    if (this.isActive) return;

    const loader = Locator.getLoader();
    loader.add(resources);
    loader.add('levelConfig', './levels/01.level')
        .load(() => {
          Locator.getEventBus().emit(Events.LevelStateIsInitialized);
          this.terminate();
        });

    this.isActive = true;
  }

  update() {

  }

  terminate() {
    this.isActive = false;
  }
}
