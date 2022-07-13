import EventEmitter from "../../../Services/EventEmitter.js";

export default class FindRegionSystem extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.entities = this.game.entities;
    this.isActive = false;
  }

  update() {
    let search = true;

    while (search) {
      let result = false;
      this.entities.forEach((entity, index) => {
        if (entity === null) return;
        if (entity.selected) {
          if (this.markNearRelation(index)) result = true;
          entity.needDestroy = true;
        }
      })

      if (!result) search = false
    }

    this.isActive = false;
  }

  markNearRelation(index) {
    const {columns, rows} = this.game.options
    const column = index % columns;
    const row = Math.floor(index / columns);

    let left = null;
    let right = null;
    let top = null;
    let bottom = null;

    if (column > 0) {
      left = this.entities[index - 1];
    }

    if (column < columns - 1) {
      right = this.entities[index + 1];
    }

    if (row > 0) {
      top = this.entities[index - columns]
    }

    if (row < rows - 1) {
      bottom = this.entities[index + columns]
    }

    let result = false;

    [left, right, top, bottom].forEach((entity) => {
      if (entity && !entity.selected && entity.texture === this.entities[index].texture) {
        entity.selected = true;
        result = true;
      }
    })

    return result
  }
}
