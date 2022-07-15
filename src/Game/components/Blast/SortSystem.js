import {Events} from "../../../Events/Events.js";
import {gsap} from 'gsap'

export default class SortSystem {
  constructor(game) {

    this.game = game
    this.isActive = false

    this.game.addEventListener(Events.activateSortSystem, () => {
      if (this.isActive) return;
      this.isActive = true
      this.game.view.interactiveChildren = false;
      this.sort()
    })
  }

  update() {

  }

  sort() {
    const sortNumber = Math.floor(0.5 * this.game.options.columns * this.game.options.rows)
    let sortQueue = new Array(sortNumber).fill(null)
    sortQueue.forEach((item, index) => {
      sortQueue[index] = Math.floor(Math.random() * this.game.options.columns * this.game.options.rows)
    })

    sortQueue = sortQueue.filter((item, index) => sortQueue.indexOf(item) === index)

    const animation = gsap.timeline()

    while (sortQueue.length > 1) {
      const pair = sortQueue.splice(0, 2)
      const entities = pair.map(index => this.game.entities[index])
      const sprites = entities.map(entity => this.game.view.getChildByName(entity.id))
      const pairAnimation = gsap.timeline()
      sprites.forEach(sprite => {
        pairAnimation.add(
          gsap.to(sprite.scale, {x: 0, y: 0, duration: 0.4, ease: 'back.in(1)'}),
          0
        )
      })
      pairAnimation.add(() => {
        entities.reverse();
        pair.forEach((fieldIndex, index) => {
          this.game.entities[fieldIndex] = entities[index]
          entities[index].updatePosition = true;
        })
      }, 0.4)
      sprites.forEach(sprite => {
        pairAnimation.add(
          gsap.to(sprite.scale, {x: 1, y: 1, duration: 0.4, ease: 'back.out(1)'}),
          0.45
        )
      })
      animation.add(pairAnimation, 0)
    }

    animation.eventCallback('onComplete', () => {
      this.isActive = false
      this.game.view.interactiveChildren = true;
    })
  }
}
