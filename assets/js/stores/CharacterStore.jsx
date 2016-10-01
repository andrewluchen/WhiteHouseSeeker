import AppDispatcher from '../AppDispatcher';
import { CHARACTERS_CHANGED } from '../ActionConstants';
import BaseStore from './BaseStore';
import LoginStore from './LoginStore';

class CharacterStore extends BaseStore {

  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.registerToActions.bind(this));
    this.characters = [];
    this.active = null;
  }

  registerToActions(action) {
    switch(action.actionType) {
      case CHARACTERS_CHANGED:
      default:
        break;
    };
  }

  fetchCharacters() {
    $.get(
      'api/charaters/',
      {
        user: UserStore.getUser().id,
      },
      function (data) {

      }.bind(this),
    );
  }

  getCharacters() {
    return this.characters;
  }

  getActive() {
    return this.active;
  }

}

export default new CharacterStore();
