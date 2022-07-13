import EventEmitter from "../../../Services/EventEmitter.js";

export default class SimpleBlastSystem extends EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.entities = this.game.entities;
    this.isActive = true;
  }

  update() {
    const selected = this.entities.filter(entity => entity && entity.selected);
    if (selected.length >= this.game.options.minRegion) {
      selected.forEach(entity => entity[entity.destroyEffect] = true)
    }

    selected.forEach(entity => delete entity.selected)

  }
}
