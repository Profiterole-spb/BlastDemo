import EventEmitter from "../../../Services/EventEmitter.js";

export default class DestroySystem extends EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.entities = this.game.entities;
    this.isActive = true;
  }

  update() {
    this.entities.forEach((entity, index) => {
      if (entity && entity.destroy) {
        this.game.view.getChildByName(entity.id).destroy()
        this.entities[index] = null
      }
    })
  }
}
