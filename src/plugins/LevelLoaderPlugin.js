import {LoaderResource} from 'pixi.js';

export default class LevelLoaderPlugin {
  static add(...args) {
    console.log('LevelLoaderPlugin.add', args);
    LoaderResource.setExtensionXhrType(
        'level',
        LoaderResource.XHR_RESPONSE_TYPE.JSON,
    );
  }
}
