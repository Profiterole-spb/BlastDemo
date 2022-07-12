import EventEmitter from "../Services/EventEmitter.js";
import Locator from "../Services/Locator.js";
import { Renderer } from 'pixi.js'
import { SETTINGS } from "./settings.js";

export default class Game extends EventEmitter {
  constructor() {
    super();

    // Setup services
    Locator.provideCanvas(document.querySelector('.webgl'))
    Locator.provideRenderer(new Renderer({view: Locator.getCanvas(), ...SETTINGS.renderer}))

    //setup clock
    Locator.getClock().addEventListener('tick', this.update, this)
  }

  update() {
    Locator.getRenderer().render(Locator.getStage(), {clear: true})
  }

  start() {
    Locator.getClock().run()
  }
}
