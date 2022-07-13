import EventEmitter from "../../Services/EventEmitter.js";
import Locator from "../../Services/Locator.js";
import { resources } from "../resources.js";

export default class LoadState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus().addEventListener('initLoadState', this.init, this)
  }

  init() {
    if (this.isActive) return;

    const loader = Locator.getLoader();
    loader.add(resources)
      .load(() => {
        Locator.getEventBus().emit('initLevelState')
        this.terminate();
      })

    this.isActive = true;
  }

  update() {

  }

  terminate() {
    this.isActive = false;
  }
}