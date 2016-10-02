import React from 'react';
import { FormControl } from 'react-bootstrap';

class CharacterSelector extends React.Component {

  render() {
    let characters = <option value=''>You have no characters...</option>;
    if (this.props.characters.length !== 0) {
      characters = [];
      this.props.characters.forEach(character => {
        characters.push(
          <option value={character.key}>{character.name}</option>
        );
      })
    }
    return (
      <div>
        <FormControl componentClass='select' onChange={this.setCharacter}>
          {characters}
        </FormControl>
      </div>
    );
  }
}

CharacterSelector.propTypes = {
  characters: React.PropTypes.array,
  onSelected: React.PropTypes.func,
}

export default CharacterSelector;
