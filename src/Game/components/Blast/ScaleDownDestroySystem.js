import EventEmitter from "../../../Services/EventEmitter.js";
import {gsap} from "gsap"

export default class ScaleDownDestroySystem extends EventEmitter {
  constructor(game) {
    super();
    this.game =  game;
    this.isActive = true;
  }

  update() {
    this.game.entities.forEach(entity => {
      if (!entity) return;
      if (entity.scaleDown) {
        delete entity.scaleDown
        gsap.to(this.game.view.getChildByName(entity.id).scale, {x: 0, y: 0, duration: 0.3, ease: 'back.in(1)'})
          .eventCallback('onComplete', () => {
            entity.destroy = true
          })
      }
    })
  }
}
