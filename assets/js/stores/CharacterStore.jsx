import AppDispatcher from '../AppDispatcher';
import { CHARACTERS_CHANGED } from '../actions/ActionConstants';
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
        this.characters = [];
        action.characters.forEach(character => {
          let fields = character.fields;
          this.characters.push({
            key: character.pk,
            name: fields.title + ' ' + fields.name + ' (' + fields.party[0] + '-' + fields.state + ')'
          });
        });
        console.log(this.characters);
        this.emitChange();
      default:
        break;
    };
  }

  getCharacters() {
    return this.characters;
  }

  getActive() {
    return this.active;
  }

}

export default new CharacterStore();
