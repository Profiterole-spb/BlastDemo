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
import BombSystem from "./BombSystem.js";


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
    this.systems.push(new BombSystem(this))
    this.systems.push(new SimpleBlastSystem(this))
    this.systems.push(new ScaleDownDestroySystem(this))
    this.systems.push(new DestroySystem(this))

    this.input.addEventListener('pointerup', this.handlePointerUp, this)
    this.addEventListener('DestroySystem: destroy', () => {
      this.emit('Activate: DropSystem')
    })

    this.addEventListener('DropSystem: no empty cells', () => {
      console.log('Input is enabled')
      this.input.view.interactive = true
    })
    this.addEventListener('SimpleBlastSystem: no region', () => {
      console.log('Input is enabled')
      this.input.view.interactive = true
    })

    this.bombBonusIsActive = false;
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
    console.log('Input is disabled')
    this.input.view.interactive = false;

    if (this.bombBonusIsActive) {
      this.emit('Activate: BombSystem')
      return;
    }

    this.emit('Activate: FindRegionSystem')
    this.emit('Activate: SimpleBlastSystem')

  }
}
