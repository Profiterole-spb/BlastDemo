import {Events} from "../../../Events/Events.js";

export default class DestroySystem {
  constructor(game) {
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
