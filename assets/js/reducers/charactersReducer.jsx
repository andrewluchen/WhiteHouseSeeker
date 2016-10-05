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
        active = character.primary ? character.id : active;
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
