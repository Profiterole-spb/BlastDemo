import {Container, NineSlicePlane, Sprite, Texture, Text} from "pixi.js";
import Locator from "../../Services/Locator.js";
import {SETTINGS} from "../settings.js";
import EventEmitter from "../../Services/EventEmitter.js";
import {GlowFilter} from 'pixi-filters'

export default class LevelScreen extends EventEmitter{
  constructor(state) {
    super()

    this.state = state
    this.view = new Container();

    this.glowFilter = new GlowFilter({distance: 60})

    const background = new Sprite(Texture.WHITE);
    background.tint = 0xa1a1a1;
    background.width = SETTINGS.renderer.width;
    background.height = SETTINGS.renderer.height;

    const topPanel = new NineSlicePlane(
      Locator.getLoader().resources['container_bg'].texture,
      80,
      80,
      80,
      80
    )
    topPanel.position.set(307, 0)
    topPanel.width = 2800
    topPanel.height = 400
    topPanel.pivot.set(0, 80)

    const field = new NineSlicePlane(
      Locator.getLoader().resources['container_bg'].texture,
      80,
      80,
      80,
      80
    )
    field.position.set(132, 438)
    field.width = 1635;
    field.height = 1819;

    const rightPanel = new NineSlicePlane(
      Locator.getLoader().resources['container_bg'].texture,
      80,
      80,
      80,
      80
    )
    rightPanel.width = 1084;
    rightPanel.height = 1016;
    rightPanel.position.set(2200, 560)

    const movesContainer = new Sprite(Locator.getLoader().resources['moves_bg'].texture)
    movesContainer.anchor.set(0.5);
    movesContainer.position.set(
      rightPanel.width / 2,
      movesContainer.height / 2 + 30
    )

    const movesText = new Text('37', {fontSize: 210, fill: '#fff', fontFamily: 'Marvin'})
    movesText.anchor.set(0.5, 0.6)

    const scoresContainer = new Sprite(Locator.getLoader().resources['scores_bg'].texture);
    scoresContainer.anchor.set(0.5, 0)
    scoresContainer.position.set(rightPanel.width / 2, 612)
    const scoresLabelText = new Text('ОЧКИ:', {fill: '#fff', fontFamily: 'Marvin', fontSize: 80})
    scoresLabelText.anchor.set(0.5, 0)
    scoresLabelText.position.set(0, 20)

    const scoresValueText = new Text('227', {fill: '#fff', fontFamily: 'Marvin', fontSize: 160})
    scoresValueText.anchor.set(0.5, 0)
    scoresValueText.position.set(0, 100)

    const pauseButton = new Sprite(Locator.getLoader().resources['container_bg'].texture)
    pauseButton.anchor.set(0.5)
    pauseButton.position.set(3318, 140)
    const pauseIcon = new Sprite(Locator.getLoader().resources['pause_icon'].texture)
    pauseIcon.anchor.set(0.5)


    const bonusTitle = new Text('Бонусы', {fill: '#fff', fontFamily: 'Marvin', fontSize: 100})
    bonusTitle.anchor.set(0.5, 0);
    bonusTitle.position.set(2740, 1660)

    const bonuses = [];
    for (let i = 0; i < 3; i++) {
      const bonusContainer = new Sprite(Locator.getLoader().resources['bonus_bg'].texture);
      bonusContainer.position.set(
        2140 + (bonusContainer.width + 50) * i,
        1820
      )

      const icon = new Sprite()
      icon.anchor.set(0.5)
      icon.name = 'icon'
      icon.position.set(bonusContainer.width / 2, 120)

      const costContainer = new Sprite(Locator.getLoader().resources['bonus_cost_bg'].texture)
      costContainer.position.set(20, bonusContainer.height - costContainer.height - 20)
      bonusContainer.addChild(costContainer, icon)

      const value = new Text('5', {fill: '#fff', fontFamily: 'Marvin', fontSize: 80})
      value.anchor.set(1, 0.6)
      value.position.set(costContainer.width - 140, costContainer.height / 2)
      costContainer.addChild(value)

      const coin = new Sprite(Locator.getLoader().resources['coin_little'].texture)
      coin.anchor.set(0.5)
      coin.position.set(costContainer.width - 90, costContainer.height / 2)
      costContainer.addChild(coin)

      bonusContainer.interactive = true;
      bonusContainer.on('pointerup', () => {
        this.emit('clickOnBonus', {index: i})
      })

      bonuses.push(bonusContainer)
    }

    bonuses[0].getChildByName('icon').texture = Locator.getLoader().resources['bomb'].texture

    pauseButton.addChild(pauseIcon)
    scoresContainer.addChild(scoresLabelText, scoresValueText)
    movesContainer.addChild(movesText)
    rightPanel.addChild(movesContainer, scoresContainer)
    this.view.addChild(background, topPanel, rightPanel, field, pauseButton,
      bonusTitle, ...bonuses)


    this.blastContainer = field
    this.movesText = movesText
    this.scoresValueText = scoresValueText
    this.bonuses = bonuses
  }

  update() {
    this.movesText.text = Math.trunc(this.state.data.movies)
    this.scoresValueText.text = Math.trunc(this.state.data.scores)

    this.bonuses.forEach((container, index)=> {
      container.filters = this.state.data.bonuses[index] ? [this.glowFilter] : []
    })
  }
}
