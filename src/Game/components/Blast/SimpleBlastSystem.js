import EventEmitter from "../../../Services/EventEmitter.js";

export default class SimpleBlastSystem extends EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.entities = this.game.entities;
    this.isActive = false;

    this.game.addEventListener('Activate: SimpleBlastSystem', () => {
      console.log('SimpleBlastSystem is enabled')
      this.isActive = true
    })
  }

  update() {
    const selected = this.entities.filter(entity => entity && entity.selected);
    if (selected.length >= this.game.options.minRegion) {
      selected.forEach(entity => entity[entity.destroyEffect] = true)
    } else {
      this.game.emit('SimpleBlastSystem: no region')

    }

    selected.forEach(entity => delete entity.selected)

    console.log('SimpleBlastSystem is disabled')
    this.isActive = false
  }
}
