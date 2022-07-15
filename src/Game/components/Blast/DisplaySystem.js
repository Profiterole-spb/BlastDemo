import Locator from "../../../Services/Locator.js";
import {Sprite} from "pixi.js";

export default class DisplaySystem {
  constructor(game) {
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
        this.setSpritePosition(sprite, index)
        this.view.addChild(sprite);
      }

      const sprite = this.view.getChildByName(entity.id)
      if (entity.texture !== sprite.textureName) {
        sprite.texture = Locator.getLoader().resources[entity.texture].texture;
        sprite.textureName = sprite.texture;
      }

      if (entity.updatePosition) {
        this.setSpritePosition(sprite, index)
        delete entity.updatePosition
      }

      if (entity.sortable)
        sprite.zIndex = this.options.rows - Math.floor(index / this.options.columns);
    })
  }

  setSpritePosition(sprite, index) {
    sprite.position.set(
      index % this.game.options.columns * this.options.cellWidth + this.options.cellWidth / 2,
      Math.floor(index / this.game.options.columns) * this.options.cellHeight + this.options.cellHeight / 2
    )
  }
}
