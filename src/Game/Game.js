import EventEmitter from "../Services/EventEmitter.js";
import Locator from "../Services/Locator.js";
import {Renderer, Container, Loader} from 'pixi.js'
import { SETTINGS } from "./settings.js";
import LevelState from "./states/LevelState.js";
import LoadState from "./states/LoadState.js";

export default class Game extends EventEmitter {
  constructor() {
    super();

    // Setup services
    Locator.provideCanvas(document.querySelector('.webgl'));
    Locator.provideRenderer(new Renderer({view: Locator.getCanvas(), ...SETTINGS.renderer}));
    Locator.provideStage(new Container());
    Locator.provideLoader(new Loader())

    //setup clock
    Locator.getClock().addEventListener('tick', this.update, this);

    // setup states
    this.states = [];
    this.states.push(
      new LoadState(),
      new LevelState()
    )

  }

  update() {
    this.states.forEach((state) => {
      if (!state.isActive) return;
      state.update();
    })

    Locator.getRenderer().render(Locator.getStage(), {clear: true});
  }

  start() {
    Locator.getClock().run();
    Locator.getEventBus().emit('initLoadState')
  }
}
