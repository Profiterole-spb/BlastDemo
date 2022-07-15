export default class GenerateSystem {
  constructor(game) {
    this.game = game;
    this.entities = this.game.entities
    this.isActive = true;
  }

  update() {
    for (let i = 0; i < this.game.options.columns; i++) {
      if (this.entities[i] === null) {
        const entity = {...this.game.options.entities.simple[this.getRandomColor()]};
        entity.id = this.getRandomID()
        this.entities[i] = entity
      }
    }
  }

  getRandomID = () => {
    return (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);
  }

  getRandomColor() {
    const colors = Object.keys(this.game.options.entities.simple)
    const index = Math.trunc(Math.random() * 100) % colors.length
    return  colors[index]
  }
}
