import EventEmitter from "../../Services/EventEmitter.js";
import LevelScreen from "../screens/LevelScreen.js";
import Locator from "../../Services/Locator.js";
import Blast from "../components/Blast/Blast.js";

export default class LevelState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus().addEventListener('initLevelState', this.init, this)
  }

  init() {
    if (this.isActive) return;

    this.screen = new LevelScreen();
    Locator.getStage().addChild(this.screen.view);

    this.blast = new Blast({
      cellWidth: 172,
      cellHeight: 172,
      cellPadding: 1,
      columns: 9,
      rows: 10,
      entities: {
        simple: {
          blue: {
            texture: 'blue',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
          },
          red: {
            texture: 'red',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
          },
          yellow: {
            texture: 'yellow',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
          },
          green: {
            texture: 'yellow',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
          },
          purple: {
            texture: 'yellow',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
          },
        }
      }
    });
    this.blast.view.position.set(40, 50)
    this.screen.blastContainer.addChild(this.blast.view)

    this.isActive = true;
  }

  update() {
    this.blast.update()
  }

  terminate() {
    this.isActive = false;
    this.screen.view.destroy();
    this.screen = null;
  }
}