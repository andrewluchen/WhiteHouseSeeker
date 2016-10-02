import {
  CHARACTERS_CHANGED,
} from '../actions/CharacterActions';

function character(state = {
    characters: [],
    active: null,
  }, action) {
  switch (action.type) {
    case CHARACTERS_CHANGED:
      let characters = [];
      action.characterss.forEach(character => {
        let fields = character.fields;
        let prefix = fields.title ? fields.title : 'Private Citizen';
        characters.push({
          key: character.pk,
          name: prefix + ' ' + fields.name + ' (' + fields.party[0] + '-' + fields.state + ')'
        });
      });
      return Object.assign({}, state, {
        characters: action.characters,
        active: 0,
      });
    default:
      return state;
  }
}

export default character;
