import EventEmitter from '../../Services/EventEmitter.js';
import Locator from '../../Services/Locator.js';
import DialogScreen from '../screens/DialogScreen.js';
import {Events} from '../../Events/Events.js';

export default class DialogState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus().addEventListener(Events.DialogStateIsInitialized, this.init, this);
  }

  init() {
    if (this.isActive) return;
    this.screen = new DialogScreen();
    Locator.getStage().addChild(this.screen);

    this.isActive = true;

    this.screen.on('skip', () => {
      this.screen.fadeOut();
    });

    this.screen.on('fadeout', () => {
      this.terminate();
    });
    this.screen.fadeIn();
  }

  update() {

  }

  terminate() {
    this.isActive = false;
    this.screen.destroy();
    this.screen = null;
    Locator.getEventBus().emit(Events.DialogStateIsTerminated);
  }
}
