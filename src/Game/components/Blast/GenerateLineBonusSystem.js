import {Events} from "../../../Events/Events.js";

export default class GenerateLineBonusSystem {
  constructor(game) {
    this.game = game;

    this.clickedItemIndex = null;
    this.region = null;

    this.game.input.addEventListener('pointerup', (position) => {
      this.clickedItemIndex = position.y * this.game.options.columns + position.x
    })

    this.game.addEventListener(Events.regionAffected, (region) => {
      if (region.length >= this.game.options.lineBonus) {
        this.region = region
      }
    })

    this.game.addEventListener(Events.regionDestroyed, (event) => {
      if (!this.region || !this.clickedItemIndex) {
        this.clickedItemIndex = null
        this.region = null
        return
      }

      const types = ['rowBonus', 'columnBonus']
      const type = Math.trunc(Math.random() * 100) % 2

      this.game.entities[this.clickedItemIndex] = {...this.game.options.entities.bonuses[types[type]]}
      this.game.entities[this.clickedItemIndex].id = this.getRandomID()
      this.clickedItemIndex = null
      this.region = null
    })

    this.isActive = true;
  }

  getRandomID = () => {
    return (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);
  }

  update() {

  }
}
