import {GlowFilter} from "pixi-filters";
import {gsap} from 'gsap';
import {Events} from "../../../Events/Events.js";

export default class TeleportSystem {
  constructor(game) {
    this.game = game;
    this.entities = game.entities;
    this.isActive = false;

    this.game.addEventListener(Events.activateTeleportSystem, () => {
      this.isActive = true
    })

    this.glow = new GlowFilter({distance: 20})
  }

  update() {
    const selected = []
    this.entities.forEach(entity => {
      if (entity.selected) {
        const sprite = this.game.view.getChildByName(entity.id)
        sprite.filters = [this.glow];
        sprite.zIndex = 1000
        sprite.pivot.y = sprite.height / 2
        delete entity.sortable
        selected.push(entity)
      }
    })

    if (selected.length === 1) {
      this.game.input.view.interactive = true;
    }

    if (selected.length === 2) {
      this.game.emit(Events.swappingTwoTiles, {items: selected})
      const sprites = selected.map(entity => this.game.view.getChildByName(entity.id))
      const positions = sprites.map(sprite => {
        return {x: sprite.x, y: sprite.y}
      });
      positions.reverse()
      const animation = gsap.timeline()
      sprites.forEach((sprite, index) => {
        animation.add(gsap.to(
          sprite, {...positions[index], duration: 0.8}
        ), 0)
      })

      animation.eventCallback('onComplete', () => {
        sprites.forEach(sprite => {
          sprite.filters = []
          sprite.pivot.set(...this.game.options.pivot)
        })
        selected.forEach(entity => {
          entity.sortable = true;
        })

        const indexes = selected.map((entity) => this.game.entities.indexOf(entity))
        const swapIndexes = indexes.slice().reverse();

        swapIndexes.forEach((index, i) => {
          this.entities[index] = selected[i]
        })

        selected.forEach((entity) => delete entity.selected)

        this.game.input.view.interactive = true;

        this.game.emit('TeleportSystem: swapped', {items: selected})
      })
    }

    this.isActive = false
  }

}
