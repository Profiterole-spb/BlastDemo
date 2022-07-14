import EventEmitter from "../../../Services/EventEmitter.js";
import {gsap} from "gsap";

export default class DropSystem extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.options = this.game.options;
    this.entities = this.game.entities;
    this.view = this.game.view;

    this.isActive = true;
    this.game.addEventListener('Activate: DropSystem', () => this.isActive = true)
  }

  update() {
    this.entities.forEach((entity, index) => {
      if (entity === null) return;
      if (entity.dropping) return;
      if (!entity.falling) return;
      // if (index > this.options.columns * this.options.rows) return;
      if (this.entities[index + this.options.columns] === null) {
        const sprite = this.view.getChildByName(entity.id);
        const position = {
          x: index % this.options.columns * this.options.cellWidth +  this.options.cellWidth / 2,
          y: Math.floor((index + this.options.columns) / this.options.columns) * this.options.cellHeight + this.options.cellHeight / 2
        }
        entity.dropping = true;
        gsap.to(sprite, {...position, duration: 0.05, ease: 'linear'})
          .eventCallback('onComplete', () => {
            delete entity.dropping;
            this.entities[index + this.options.columns] = entity;
            this.entities[index] = null
          })
      }
    })

    if (this.entities.findIndex((entity) => entity === null) < 0) {
      this.isActive = false;
      this.game.emit('DropSystem: no empty cells')
    }
  }
}
