import {Container, NineSlicePlane} from 'pixi.js';
import Locator from '../../Services/Locator.js';

export default class ProgressBar extends Container {
  constructor() {
    super();

    this._value = 0;

    this.back = new NineSlicePlane(
        Locator.getLoader().resources['progress_back'].texture,
        54,
        0,
        54,
        0,
    );

    this.fill = new NineSlicePlane(
        Locator.getLoader().resources['progress_fill'].texture,
        54,
        0,
        54,
        0,
    );

    this.addChild(this.back, this.fill);
  }

  set value(value) {
    this._value = value;
    if (value < 0) this._value = 0;
    if (value > 1) this._value = 1;
    this.fill.width = this.back.width * this._value;
  }
}
