import {LoaderResource} from 'pixi.js';

export default class LevelLoaderPlugin {
  static add() {
    LoaderResource.setExtensionXhrType(
        'level',
        LoaderResource.XHR_RESPONSE_TYPE.JSON,
    );
  }
}
