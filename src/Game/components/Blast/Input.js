
import EventEmitter from "../../../Services/EventEmitter.js";
import {Graphics} from "pixi.js";

export default class Input extends EventEmitter {

  static getDefaultOptions() {
    return {
      cellWidth: 100,
      cellHeight: 100,
      cellPadding: 2,
      columns: 10,
      rows: 10,
      listOfGeneralGems: [],
    }
  }

  constructor(options) {
    super();
    this.options = Object.assign(Input.getDefaultOptions(), options)
    this.view = new Graphics();
    this.view.alpha = 0
    this.view.zIndex = 1000
    // this.view.interactive = true;
    this.drawField()

    this.touching = false;
    this.pointer = {x: null, y: null};
    this.overCell = {x: null, y: null};
    this.outCell = {x: null, y: null};

    this.view.interactive = true;
    this.view.on('pointerdown', (e) => {
      this.touching = true;
      this.pointer = e.data.getLocalPosition(this.view);
      this.updateCells(e)
      this.outCell = this.overCell;
      this.emit('pointerdown')
    })
    this.view.on('pointerup', (e) => {
      this.touching = false
      this.emit('pointerup', {...this.overCell})
    })
    this.view.on('pointerout', (e) => {
      if (!this.touching) return
      this.touching = false
      this.emit('pointerout')
    })
    this.view.on('pointermove', (e) => {
      if (!this.touching) return;
      this.pointer = e.data.getLocalPosition(this.view);

      if (this.pointer.x < 0 || this.pointer.x > this.options.columns * this.options.cellWidth) {
        this.emit('pointerout')
        return;
      }
      if (this.pointer.y < 0 || this.pointer.y > this.options.rows * this.options.cellHeight) {
        this.emit('pointerout')
        return;
      }

      this.updateCells()
      if (this.overCell.x !== this.outCell.x || this.overCell.y !== this.outCell.y) {
        this.emit('outCell', this.outCell);
        this.emit('overCell', this.overCell);
        this.outCell = this.overCell;
      }
    })
  }

  drawField() {
    this.view.beginFill(0x00ff00, 0.3)
    this.view.drawRect(0, 0,
      (this.options.cellWidth + this.options.cellPadding) * this.options.columns,
      (this.options.cellHeight + this.options.cellPadding) * this.options.rows
    )
    this.view.endFill()
    this.view.lineStyle(3, 0xff0000)
    for (let i = 0; i < this.options.columns; i++) {
      for (let j = 0; j < this.options.rows; j++) {
        this.view.drawRect(
          i * (this.options.cellWidth + this.options.cellPadding),
          j * (this.options.cellHeight + this.options.cellPadding),
          (this.options.cellWidth + this.options.cellPadding),
          (this.options.cellHeight + this.options.cellPadding)
        )
      }
    }
  }

  updateCells() {
    this.overCell = {
      x: Math.floor(this.pointer.x / (this.options.cellWidth + this.options.cellPadding)),
      y: Math.floor(this.pointer.y / (this.options.cellHeight + this.options.cellPadding))
    }
  }
}
