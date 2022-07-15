import {Events} from "../../../Events/Events.js";

export default class SimpleBlastSystem {
  constructor(game) {
    this.game = game;
    this.entities = this.game.entities;
    this.isActive = false;

    this.game.addEventListener(Events.activateSimpleBlastSystem, () => {
      this.isActive = true
    })
  }

  update() {
    const selected = this.entities.filter(entity => entity && entity.selected);
    if (selected.length === 0) return;
    if (selected.length >= this.game.options.minRegion) {
      selected.forEach(entity => entity[entity.destroyEffect] = true)
      this.game.emit(Events.regionSelected, selected.slice())
    } else {
      this.game.emit(Events.noRegion)
    }

    selected.forEach(entity => delete entity.selected)

    this.isActive = false
  }
}
