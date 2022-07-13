
import {Sprite, Texture} from "pixi.js";
import EventEmitter from "../../../Services/EventEmitter.js";

export default class Input extends EventEmitter {

  static getDefaultOptions() {
    return {
      cellWidth: 172,
      cellHeight: 172,
      cellPadding: 1,
      columns: 9,
      rows: 10,
    }
  }

  constructor(options) {
    super();
    this.options = Object.assign(Input.getDefaultOptions(), options)
    this.view = new Sprite(Texture.WHITE);
    this.view.tint = 0xff0000
    this.view.width = this.options.cellWidth * this.options.columns
    this.view.height = this.options.cellHeight * this.options.rows
    this.view.alpha = 0.2
    this.view.interactive = true;

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
      this.emit('pointerup')
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

  updateCells() {
    this.overCell = {
      x: Math.floor(this.pointer.x / (this.options.cellWidth + this.options.cellPadding)),
      y: Math.floor(this.pointer.y / (this.options.cellHeight + this.options.cellPadding))
    }
  }
}
