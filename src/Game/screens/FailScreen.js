import {Container, NineSlicePlane, Sprite, Texture, Text} from "pixi.js";
import Locator from "../../Services/Locator.js";
import {SETTINGS} from "../settings.js";
import {gsap} from 'gsap';

export default class FailScreen extends Container {
  constructor() {
    super();

    const bubbleSpeech = `Ты проиграл (`

    const back = new Sprite(Texture.WHITE)
    back.tint = 0x00000;
    back.alpha = 0.8
    back.width = SETTINGS.renderer.width;
    back.height = SETTINGS.renderer.height;

    const gull = new Sprite(Locator.getLoader().resources.gull.texture)
    gull.scale.set(4)
    gull.position.set(1500, 600)

    const dialogContainer = new NineSlicePlane(
      Locator.getLoader().resources['container_bg'].texture,
      80,
      80,
      80,
      80
    )
    dialogContainer.position.set(
      807,
      back.height - dialogContainer.height - 400
    )
    dialogContainer.width = 2200
    dialogContainer.height = 500

    const text = new Text(bubbleSpeech, {fill: '#ffffff', fontFamily: 'Marvin', fontSize: 60})
    text.position.set(100, 150)

    dialogContainer.addChild(text)
    this.addChild(back, gull, dialogContainer)
    this.visible = false

    this.refs = {back, gull, dialogContainer, text}

    back.on('pointerdown', () => {
      this.emit('skip')
    })
  }

  fadeIn() {
    const {back, gull, dialogContainer, text} = this.refs

    this.fadeAnimation = gsap.timeline()
      .set(this, {visible: true})
      .from(back, {alpha: 0, duration: 0.4})
      .from(gull, {y: '-=1500', duration: 0.4, ease: 'back.out(1.2)'})
      .from(dialogContainer, {width: 0, duration: 0.3, ease: 'back.out(1.2)'})
      .from(text, {alpha: 0, duration: 0.3})
      // .set(back, {interactive: true})
  }

  fadeOut() {
    const {back, gull, dialogContainer, text} = this.refs
    this.fadeAnimation.reverse()

    this.fadeAnimation.eventCallback('onReverseComplete', () => {
      this.emit('fadeout')
    })
  }
}
