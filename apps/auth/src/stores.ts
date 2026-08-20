import { makeAutoObservable } from 'mobx';

class Store {
  token = '';
  returnUrl = 'http://localhost:3002/events';

  constructor() {
    makeAutoObservable(this);
  }

  setToken(newToken: string) {
    this.token = newToken;
  }

  removeToken() {
    this.token = '';
  }

  setReturnUrl(newUrl: string) {
    this.returnUrl = newUrl;
  }

  removeReturnUrl() {
    this.returnUrl = '';
  }
}

const store = new Store();
export default store;
