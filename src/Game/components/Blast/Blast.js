import EventEmitter from "../../../Services/EventEmitter.js";
import Input from "./Input.js";
import BlastView from "./BlastView.js";
import GenerateSystem from "./GenerateSystem.js";

export default class Blast extends EventEmitter {
  constructor(options) {
    super();

    this.view = new BlastView(options);
    this.input = new Input(options);
    this.view.addChild(this.input.view)

    this.entities = [];
    this.systems = [];

    this.systems.push(new GenerateSystem(this))
  }

  update() {
    this.systems.forEach((system) => {
      system.update()
    })
  }
}
