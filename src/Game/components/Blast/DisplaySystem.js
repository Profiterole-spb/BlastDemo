import EventEmitter from "../../../Services/EventEmitter.js";
import Locator from "../../../Services/Locator.js";
import {Sprite} from "pixi.js";

export default class DisplaySystem extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.options = this.game.options;
    this.entities = this.game.entities
    this.view = this.game.view
    this.view.sortableChildren = true;
    this.isActive = true;
  }

  update() {
    this.entities.forEach((entity, index) => {
      if (entity === null) return;
      if (!this.view.getChildByName(entity.id)) {
        const sprite = new Sprite(Locator.getLoader().resources[entity.texture].texture)
        sprite.textureName = entity.texture
        sprite.name = entity.id
        sprite.pivot.set(...this.options.pivot)
        sprite.position.set(
          this.options.cellWidth * index + this.options.cellWidth / 2,
          this.options.cellHeight / 2
        )
        this.view.addChild(sprite);
      }

      const sprite = this.view.getChildByName(entity.id)
      if (entity.texture !== sprite.textureName) {
        sprite.texture = Locator.getLoader().resources[entity.texture].texture;
        sprite.textureName = sprite.texture;
      }
      if (entity.sortable)
        sprite.zIndex = this.options.rows - Math.floor(index / this.options.columns);
    })
  }
}
