import {Container, Sprite, Text, Texture} from 'pixi.js';
import ProgressBar from '../components/ProgressBar.js';
import {SETTINGS} from '../settings.js';
import Locator from "../../Services/Locator.js";

export default class LoadingScreen extends Container {
  constructor() {
    super();

    const background = new Sprite(Texture.WHITE);
    background.tint = 0xa1a1a1;
    background.width = SETTINGS.renderer.width;
    background.height = SETTINGS.renderer.height;

    const loadingText = new Text('Loading', {
      fontSize: 100, fill: '#fff', fontFamily: 'Marvin',
    });
    loadingText.anchor.set(0.5, 0.5);
    loadingText.position.set(
        background.width / 2,
        background.height / 2,
    );

    this.progress = new ProgressBar();
    this.progress.position.set(
        background.width / 2 - this.progress.width / 2,
        background.height / 2 - this.progress.height / 2 + 200,
    );
    this.addChild(background, loadingText, this.progress);
  }

  update() {
    this.progress.value = Locator.getLoader().progress / 100;
  }
}
