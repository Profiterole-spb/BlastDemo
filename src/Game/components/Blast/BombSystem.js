import EventEmitter from "../../../Services/EventEmitter.js";
import {gsap} from 'gsap'
import {Events} from "../../../Events/Events.js";

export default class BombSystem extends EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.entities = this.game.entities;
    this.isActive = false;

    this.game.addEventListener(Events.activateBombSystem, () => {
      this.isActive = true
    })
  }

  update() {
    this.entities.forEach((entity, index) => {
      if (!entity) return;
      if (entity.selected) {
        delete entity.selected;
        Object.assign(entity, this.game.options.entities.bonuses.bomb)
        const sprite = this.game.view.getChildByName(entity.id);
        delete entity.sortable
        delete entity.falling
        sprite.zIndex = 1000

        const bombPosition = {
          x: index % this.game.options.columns,
          y: Math.floor(index / this.game.options.columns),
        }

        const destroyed = this.entities.filter((ent, i) => {
          if (i === index) return false;
          const position = {
            x: i % this.game.options.columns,
            y: Math.floor(i / this.game.options.columns),
          }

          if(
            Math.abs(bombPosition.x - position.x) <= entity.radius &&
            Math.abs(bombPosition.y - position.y) <= entity.radius
          ) {
            if (ent.type === 'simple') {
              return true
            }
          }
        })

        const animation = gsap.timeline()
          .to(sprite.scale, {x: 3, y: 3, duration: 0.4})
          .to(sprite, {rotation: -0.1, duration: 0.2}, '<')
          .to(sprite.scale, {x: 0, y: 0, duration: 0.3})
          .eventCallback('onComplete', () => {
            entity.destroy = true;
            destroyed.forEach(e => e.destroy = true)
            this.isActive = false
          })

        destroyed.forEach((e) => {
          animation.add(gsap.to(
            this.game.view.getChildByName(e.id).scale, {x: 0, y: 0, duration: 0.3}
          ), 0.6)
        })
      }

    })

  }
}
