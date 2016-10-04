import {
  CHARACTERS_CHANGED,
  CHARACTER_SELECTED,
} from '../actions/CharacterActions';

function characters(state = {
    characters: [],
    active: 0,
  }, action) {
  switch (action.type) {
    case CHARACTERS_CHANGED:
      let characters = [];
      let active = 0;
      action.characters.forEach(character => {
        let fields = character.fields;
        let prefix = fields.title ? fields.title : 'Private Citizen';
        character.description = (
          prefix + ' ' + fields.name + ' (' + fields.party[0] + '-' + fields.state + ')'
        );
        active = fields.primary ? character.pk : active;
      });
      return Object.assign({}, state, {
        characters: action.characters,
        active: active,
      });
    case CHARACTER_SELECTED:
      return Object.assign({}, state, {
        active: action.active,
      });
    default:
      return state;
  }
}

export default characters;
