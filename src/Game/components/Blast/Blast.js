import EventEmitter from "../../../Services/EventEmitter.js";
import Input from "./Input.js";
import BlastView from "./BlastView.js";
import GenerateSystem from "./GenerateSystem.js";
import DisplaySystem from "./DisplaySystem.js";
import DropSystem from "./DropSystem.js";
import FindRegionSystem from "./FindRegionSystem.js";
import DestroySystem from "./DestroySystem.js";
import SimpleBlastSystem from "./SimpleBlastSystem.js";
import ScaleDownDestroySystem from "./ScaleDownDestroySystem.js";


export default class Blast extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.view = new BlastView(options);
    this.input = new Input(options);
    this.view.addChild(this.input.view)

    this.entities = new Array(this.options.rows * this.options.columns).fill(null);
    this.systems = [];

    this.systems.push(new GenerateSystem(this))
    this.systems.push(new DisplaySystem(this))
    this.systems.push(new DropSystem(this))
    this.systems.push(new FindRegionSystem(this))
    this.systems.push(new SimpleBlastSystem(this))
    this.systems.push(new ScaleDownDestroySystem(this))
    this.systems.push(new DestroySystem(this))

    this.input.addEventListener('pointerup', this.handlePointerUp, this)
  }

  update() {
    this.systems.forEach((system) => {
      if (!system.isActive) return;
      system.update()
    })
  }

  handlePointerUp(event) {
    const {x, y} = event
    const entity = this.entities[y * this.options.columns + x]
    entity.selected = true;

    console.log('selected', entity)
    this.systems[3].isActive = true;
    // this.input.view.interactive = false;
    // this.view.getChildByName(entity.id).destroy()
    // this.entities[y * this.options.columns + x] = null
  }
}
