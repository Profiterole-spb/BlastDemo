import EventEmitter from '../../Services/EventEmitter.js';
import LevelScreen from '../screens/LevelScreen.js';
import Locator from '../../Services/Locator.js';
import Blast from '../components/Blast/Blast.js';
import {Events} from '../../Events/Events.js';

export default class LevelState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus().addEventListener(Events.LevelStateIsInitialized, this.init, this);
  }

  init() {
    if (this.isActive) return;

    this.data = Locator.getLoader().resources.levelConfig.data.data;

    this.screen = new LevelScreen(this);
    Locator.getStage().addChild(this.screen.view);

    this.blast = new Blast(Locator.getLoader().resources.levelConfig.data.blast);
    this.blast.view.position.set(45, 60);
    this.screen.blastContainer.addChild(this.blast.view);
    this.screen.view.interactiveChildren = false;

    this.blast.addEventListener(Events.regionSelected, this.handleMovies, this);
    this.blast.addEventListener(Events.swappingTwoTiles, () => {
      this.data.bonuses[1] = false;
      this.blast.teleportBonusIsActive = false;
      this.handleMovies();
    }, this);
    this.blast.addEventListener(Events.tilesDestroyed, this.handleDestroyItems, this);

    this.blast.addEventListener(Events.bombExploded, () => {
      this.data.bonuses[0] = false;
      this.blast.bombBonusIsActive = false;
      this.handleMovies();
    }, this);

    const showDialog = () => {
      this.blast.removeEventListener(Events.fieldIsFull, showDialog, this);
      Locator.getEventBus().emit(Events.DialogStateIsInitialized);
    };

    // this.blast.addEventListener(Events.fieldIsFull, showDialog, this);

    this.blast.addEventListener(Events.sortEnd, () => {
      this.data.sort += 1;
      if (this.data.sort === this.data.maxSort) {
        this.handleFail();
      }
    });

    this.screen.addEventListener(Events.clickOnBonus, (e) => {
      this.data.bonuses[e.index] = !this.data.bonuses[e.index];
      this.blast.bombBonusIsActive = this.data.bonuses[0];
      this.blast.teleportBonusIsActive = this.data.bonuses[1];
    });

    this.screen.addEventListener(Events.clickOnSort, (e) => {
      this.blast.emit(Events.activateSortSystem);
    });

    // Locator.getEventBus().once(Events.DialogStateIsTerminated, () => {
      this.screen.view.interactiveChildren = true;
    // });

    this.isActive = true;
  }

  handleMovies() {
    this.data.movies -= 1;
    if (this.data.movies === 0) {
      this.screen.blastContainer.interactiveChildren = false;
    }
  }

  handleDestroyItems(data) {
    const scores = data.length ** 2;
    this.data.scores += scores;

    this.checkScores();
  }

  checkScores() {
    if (this.data.movies >= 0 && this.data.scores >= this.data.scoresForWin) {
      this.handleWin();
    }

    if (this.data.movies === 0 && this.data.scores < this.data.scoresForWin) {
      this.handleFail();
    }
  }

  handleWin() {
    this.screen.view.interactiveChildren = false;
    Locator.getEventBus().emit(Events.WinStateIsInitialized);
  }

  handleFail() {
    this.screen.view.interactiveChildren = false;
    Locator.getEventBus().emit(Events.FailStateIsInitialized);
  }

  update() {
    this.blast.update();
    this.screen.update();
  }

  terminate() {
    this.isActive = false;
    this.screen.view.destroy();
    this.screen = null;
  }
}
