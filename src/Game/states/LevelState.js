import EventEmitter from "../../Services/EventEmitter.js";
import LevelScreen from "../screens/LevelScreen.js";
import Locator from "../../Services/Locator.js";
import Blast from "../components/Blast/Blast.js";
import {Events} from "../../Events/Events.js";

export default class LevelState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus().addEventListener(Events.LevelStateIsInitialized, this.init, this)
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

      columns: 9,
      rows: 10,
      pivot: [172 / 2, 172 / 2 + 22],
      minRegion: 2,
      lineBonus: 5,
      entities: {
        bonuses: {
          bomb: {
            texture: 'bomb',
            type: 'bonus',
            radius: 1
          },
          rowBonus: {
            texture: 'rowBonus',
            falling: true,
            type: 'bonus',
            sortable: true,
          },
          columnBonus: {
            texture: 'columnBonus',
            falling: true,
            type: 'bonus',
            sortable: true,
          },
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
    this.screen.view.interactiveChildren = false

    this.blast.addEventListener(Events.regionSelected, this.handleMovies, this)
    this.blast.addEventListener(Events.swappingTwoTiles, () => {
      this.data.bonuses[1] = false;
      this.blast.teleportBonusIsActive = false;
      this.handleMovies()
    }, this)
    this.blast.addEventListener(Events.tilesDestroyed, this.handleDestroyItems, this)
    this.blast.addEventListener(Events.activateBombSystem, () => {
      this.data.bonuses[0] = false
      this.blast.bombBonusIsActive = false
    })

    const showDialog = () => {
      this.blast.removeEventListener(Events.fieldIsFull, showDialog, this)
      Locator.getEventBus().emit(Events.DialogStateIsInitialized)
    }

    this.blast.addEventListener(Events.fieldIsFull, showDialog, this)

    this.screen.addEventListener(Events.clickOnBonus, (e) => {
      this.data.bonuses[e.index] = !this.data.bonuses[e.index]
      this.blast.bombBonusIsActive = this.data.bonuses[0]
      this.blast.teleportBonusIsActive = this.data.bonuses[1]
    })

    this.screen.addEventListener(Events.clickOnSort, (e) => {
      this.blast.emit(Events.activateSortSystem)
    })

    Locator.getEventBus().once(Events.DialogStateIsTerminated, () => {
      this.screen.view.interactiveChildren = true
    })

    this.isActive = true;
  }

  handleMovies() {
    this.data.movies -= 1;
    if (this.data.movies === 0) {
      this.screen.blastContainer.interactiveChildren = false
    }
  }

  handleDestroyItems(data) {
    const scores = data.length ** 2
    this.data.scores += scores

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
    this.screen.view.interactiveChildren = false
    Locator.getEventBus().emit(Events.WinStateIsInitialized)
  }

  handleFail() {
    console.log('fail')
    this.screen.view.interactiveChildren = false
    Locator.getEventBus().emit(Events.FailStateIsInitialized)
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
