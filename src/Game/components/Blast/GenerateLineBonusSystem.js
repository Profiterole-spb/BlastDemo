import EventEmitter from "../../../Services/EventEmitter.js";

export default class GenerateLineBonusSystem extends EventEmitter {
  constructor(game) {
    super();

    this.game = game;

    this.clickedItemIndex = null;
    this.region = null;

    this.game.input.addEventListener('pointerup', (position) => {
      console.log('GenerateLineBonusSystem: handlePointerUp', position)
      this.clickedItemIndex = position.y * this.game.options.columns + position.x
    })

    this.game.addEventListener('RegionAffected', (region) => {
      console.log('GenerateLineBonusSystem: handleRegionAffected', region)
      if (region.length >= this.game.options.lineBonus) {
        this.region = region
        console.log('region: ', this.region)
      }
    })

    this.game.addEventListener('RegionDestroyed', (event) => {
      console.log('GenerateLineBonusSystem: handleRegionDestroyed', event)
      if (!this.region || !this.clickedItemIndex) {
        this.clickedItemIndex = null
        this.region = null
        return
      }

      console.log('GenerateLineBonusSystem: create entity: ', this.clickedItemIndex)

      const types = ['rowBonus', 'columnBonus']
      const type = Math.trunc(Math.random() * 100) % 2
      // const type = 1
      console.log('type ', type)

      this.game.entities[this.clickedItemIndex] = {...this.game.options.entities.bonuses[types[type]]}
      this.game.entities[this.clickedItemIndex].id = this.getRandomID()
      console.log(this.game.entities[this.clickedItemIndex])
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
