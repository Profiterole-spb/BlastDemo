import EventEmitter from '../../Services/EventEmitter.js';
import Locator from '../../Services/Locator.js';
import {resources} from '../resources.js';
import {Events} from '../../Events/Events.js';
import LoadingScreen from '../screens/LoadingScreen.js';
import {gsap} from 'gsap';

export default class LoadState extends EventEmitter {
  constructor() {
    super();

    this.isActive = false;

    Locator.getEventBus()
        .addEventListener(Events.LoadStateIsInitialized, this.init, this);
  }

  init() {
    if (this.isActive) return;

    const loader = Locator.getLoader();
    loader.add(resources.find((res) => res.name === 'progress_back'));
    loader.add(resources.find((res) => res.name === 'progress_fill'));

    resources.splice(
        resources.findIndex((res) => res.name === 'progress_back'),
        1,
    );
    resources.splice(
        resources.findIndex((res) => res.name === 'progress_fill'),
        1,
    );

    loader.load(() => {
      this.screen = new LoadingScreen();
      Locator.getStage().addChild(this.screen);


      loader.add(resources);
      loader.add('levelConfig', './levels/01.level')
          .load(() => {
            gsap.to({duratuin: 0}, {duration: 0.6})
                .eventCallback('onComplete', () => {
                  this.terminate();
                  Locator.getEventBus().emit(Events.LevelStateIsInitialized);
                });
          });

      this.isActive = true;
    });
  }

  update() {
    this.screen.update();
  }

  terminate() {
    this.isActive = false;
  }
}
