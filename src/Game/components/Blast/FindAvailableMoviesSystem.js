import {Events} from "../../../Events/Events.js";

export default class FindAvailableMoviesSystem {
  constructor(game) {

    this.game = game

    this.isActive = false

    this.game.addEventListener(Events.activateFindAvailableMoviesSystem, () => {
      if (this.isActive) return;
      this.isActive = true
      this.analyzeField()
    })
  }

  update() {

  }

  analyzeField() {
    const bonus = this.findBonus();
    if (bonus) {
      this.game.emit(Events.availableMoves, [bonus])
      this.isActive = false;
      return;
    }

    const regions = this.findRegions()

    if (regions.length > 0) {
      this.game.emit(Events.availableMoves, regions)
    } else {
      this.game.emit(Events.noAvailableMove, regions)
    }

    this.isActive = false;
  }

  findBonus() {
    const { entities } = this.game
    return entities.find(entity => entity.type === 'bonus')
  }

  findRegions() {
    const { entities, options } = this.game;
    const cells = {};
    for (let i = 0; i < options.columns * options.rows; i++) {
      cells[i] = []

      const {columns, rows} = options;
      const column = i % columns;
      const row = Math.floor(i / columns);

      let left = null;
      let right = null;
      let top = null;
      let bottom = null;

      if (column > 0) {
        left = entities[i - 1];
      }

      if (column < columns - 1) {
        right = entities[i + 1];
      }

      if (row > 0) {
        top = entities[i - columns]
      }

      if (row < rows - 1) {
        bottom = entities[i + columns]
      }

      [left, right, top, bottom].forEach((entity, index) => {
        if (entity && entity.texture === entities[i].texture) {
          cells[i].push(entities.indexOf(entity))
        }
      })

    }

    for (const targetCell in cells) {
      if (cells[targetCell].length === 0) continue
      for (const checkCell in cells) {
        if (cells[checkCell].length === 0) continue;
        if (checkCell === targetCell) continue;
        if (cells[checkCell].includes(+targetCell)) {
          cells[targetCell] = [...cells[targetCell], ...cells[checkCell]];
          cells[checkCell] = [];
        }
      }
    }

    let regions = Object.values(cells).filter((array) => array.length)
    regions.forEach((region, index, arr) => arr[index] = region.filter((item, index) => region.indexOf(item) === index))
    regions = regions.filter(array => array.length >= options.minRegion)

    return regions
  }
}
