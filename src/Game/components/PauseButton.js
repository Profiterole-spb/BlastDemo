import {Container, Loader} from "pixi.js";
import Locator from "../../Services/Locator.js";

export default class PauseButton extends Container {
  constructor() {
    super();

    const back = new Sprite(Locator.getLoader().resources['container_bg'])
  }
}
