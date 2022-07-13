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

    this.data = {
      movies: 20,
      scores: 0,
      scoresForWin: 500,
      bonuses: [false, false, false]
    }

    this.screen = new LevelScreen(this);
    Locator.getStage().addChild(this.screen.view);

    this.blast = new Blast({
      cellWidth: 172,
      cellHeight: 172,
      cellPadding: 0,
      pivot: [172 / 2, 172 / 2 + 22],
      columns: 9,
      rows: 10,
      minRegion: 2,
      entities: {
        bonuses: {
          bomb: {
            texture: 'bomb',
            type: 'bonus',
            destroyEffect: 'explosion',
            radius: 1
          }
        },
        simple: {
          blue: {
            texture: 'blue',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
            sortable: true,
          },
          red: {
            texture: 'red',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
            sortable: true,
          },
          yellow: {
            texture: 'yellow',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
            sortable: true,
          },
          green: {
            texture: 'green',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
            sortable: true,
          },
          purple: {
            texture: 'purple',
            type: 'simple',
            falling: true,
            destroyEffect: 'scaleDown',
            sortable: true,
          },
        }
      }
    });
    this.blast.view.position.set(45, 60)
    this.screen.blastContainer.addChild(this.blast.view)

    this.blast.addEventListener('SimpleBlastSystem: use region', this.handleMovies, this)
    this.blast.addEventListener('DestroySystem: destroy', this.handleDestroyItems, this)

    this.screen.addEventListener('clickOnBonus', (e) => {
      this.data.bonuses[e.index] = !this.data.bonuses[e.index]
      this.blast.bombBonusIsActive = this.data.bonuses[0]
    })

    this.isActive = true;
  }

  handleMovies() {

  }

  handleDestroyItems(data) {
    console.log(data)
    const scores = data.length ** 2
    this.data.scores += scores

    this.data.movies -= 1;
    if (this.data.movies === 0) {
      this.screen.blastContainer.interactiveChildren = false
    }

    this.checkScores()
  }

  checkScores() {
    if (this.data.movies >= 0 && this.data.scores >= this.data.scoresForWin) {
      this.handleWin()
    }

    if (this.data.movies === 0 && this.data.scores < this.data.scoresForWin) {
      this.handleFail()
    }
  }

  handleWin() {
    console.log('win')
  }

  handleFail() {
    console.log('fail')
  }

  update() {
    this.blast.update()
    this.screen.update()
  }

  terminate() {
    this.isActive = false;
    this.screen.view.destroy();
    this.screen = null;
  }
}
