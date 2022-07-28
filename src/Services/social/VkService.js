import bridge from '@vkontakte/vk-bridge';

export default class VkService {
  constructor() {
    this.inited = false;
  }

  init() {
    console.log('init vk bridge');
    console.log('bridge', bridge);
    bridge.send('VKWebAppInit', {}).then(() => {
      console.log('receive data');
      this.inited = true;
    });
  }

  getUserInfo() {
    return bridge.send('VKWebAppGetUserInfo');
  }
}
