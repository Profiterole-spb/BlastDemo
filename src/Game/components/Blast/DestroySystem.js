import EventEmitter from "../../../Services/EventEmitter.js";
import {Events} from "../../../Events/Events.js";

export default class DestroySystem extends EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.entities = this.game.entities;
    this.isActive = true;
  }

  update() {
    const destroyed = []
    this.entities.forEach((entity, index) => {
      if (entity && entity.destroy) {
        this.game.view.getChildByName(entity.id).destroy()
        destroyed.push(this.entities[index])
        this.entities[index] = null
      }
    })
    if (destroyed.length > 0) {
      this.game.emit(Events.tilesDestroyed, destroyed)
    }
  }
}
