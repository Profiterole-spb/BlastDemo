import {Container, NineSlicePlane, Sprite, Texture, Text} from "pixi.js";
import Locator from "../../Services/Locator.js";
import {SETTINGS} from "../settings.js";
import {gsap} from 'gsap';

export default class WinScreen extends Container {
  constructor() {
    super();

    const bubbleSpeech = `Ты победил!!!`

    const back = new Sprite(Texture.WHITE)
    back.tint = 0x00000;
    back.alpha = 0.4
    back.width = SETTINGS.renderer.width;
    back.height = SETTINGS.renderer.height;

    const pirate = new Sprite(Locator.getLoader().resources.pt.texture)
    pirate.scale.set(2.4)
    pirate.anchor.set(0, 0.9)
    pirate.position.set(500, back.height)

    const dialogContainer = new NineSlicePlane(
      Locator.getLoader().resources['container_bg'].texture,
      80,
      80,
      80,
      80
    )
    dialogContainer.position.set(
      807,
      back.height - dialogContainer.height - 1200
    )
    dialogContainer.width = 2200
    dialogContainer.height = 500

    const text = new Text(bubbleSpeech, {fill: '#ffffff', fontFamily: 'Marvin', fontSize: 60})
    text.position.set(100, 150)

    dialogContainer.addChild(text)
    console.log(dialogContainer)
    this.addChild(back, pirate, dialogContainer)
    this.visible = false

    this.refs = {back, pirate, dialogContainer, text}

    back.on('pointerdown', () => {
      this.emit('skip')
    })
  }

  fadeIn() {
    const {back, pirate, dialogContainer, text} = this.refs

    this.fadeAnimation = gsap.timeline()
      .set(this, {visible: true})
      .from(back, {alpha: 0, duration: 0.4})
      .from(pirate, {y: '+=1900', duration: 0.4, ease: 'back.out(1.2)'})
      .from(dialogContainer, {width: 0, duration: 0.3, ease: 'back.out(1.2)'})
      .from(text, {alpha: 0, duration: 0.3})
      // .set(back, {interactive: true})
  }

  fadeOut() {
    const {back, pirate, dialogContainer, text} = this.refs
    this.fadeAnimation.reverse()

    this.fadeAnimation.eventCallback('onReverseComplete', () => {
      this.emit('fadeout')
    })
  }
}
