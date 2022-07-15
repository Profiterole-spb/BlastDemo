import EventEmitter from "../../Services/EventEmitter.js";
import Locator from "../../Services/Locator.js";
import WinScreen from "../screens/WinScreen.js";
import {Events} from "../../Events/Events.js";

export default class WinState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus().addEventListener(Events.WinStateIsInitialized, this.init, this)
  }

  init() {
    if (this.isActive) return;
    this.screen = new WinScreen();
    Locator.getStage().addChild(this.screen)

    this.isActive = true;

    this.screen.on('skip', () => {
      this.screen.fadeOut()
    })

    this.screen.on('fadeout', () => {
      this.terminate()
    })
    this.screen.fadeIn()
  }

  update() {

  }

  terminate() {
    this.isActive = false;
    this.screen.destroy()
    this.screen = null;
    Locator.getEventBus().emit('WinState:terminated')
  }
}
