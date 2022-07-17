import {gsap} from 'gsap';

export default class RowBonusSystem {
  constructor(game) {
    this.game = game;
    this.entities = this.game.entities;

    this.isActive = true;
  }

  update() {
    this.entities.forEach((entity, index) => {
      if (!entity) return
      if (entity.texture !== 'rowBonus') return;
      if (!entity.selected) return;

      delete entity.sortable
      delete entity.selected
      const column = index % this.game.options.columns;
      const row = Math.floor(index / this.game.options.columns);
      const sprite = this.game.view.getChildByName(entity.id)
      sprite.zIndex = 1000;

      const animation = gsap.timeline()
        .to(sprite.scale, {x: 3, duration: 0.4, ease: 'back.in(3)'})
        .to(sprite.scale, {x: 1, duration: 0.2, ease: 'back.in(3)'})
        .to(sprite.scale, {x: 0, y: 0, duration: 0.1})
        .call(() => {
          for (let i = 0; i < this.game.options.columns; i++) {
            if (i === column) continue;
            const target = this.entities[row * this.game.options.columns + i]
            if (!target) continue;
            if (target.type === 'simple') target[target.destroyEffect] = true;
            if (target.type === 'bonus') target.selected = true;
          }
        })
        .eventCallback('onComplete', () => {
          entity.destroy = true
        })
    })
  }
}
