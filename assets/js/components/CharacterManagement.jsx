import React from 'react';

import CharacterSelector from './Character/CharacterSelector';
import CharacterEditor from './Character/CharacterEditor';

class CharacterManagement extends React.Component {

  constructor() {
    super();
    this.state = {
      character: null,
      availableCharacters: [],
    };
    this.onCharacterSelected = this.onCharacterSelected.bind(this);
  }

  onCharacterSelected(characterID) {
    $.get('api/charater/' + characterID + '/', function (data) {

    })
  }

  render() {
    let editor = <CharacterEditor endpoint='/api/character/' verb='POST' data={{}}/>
    if (false) {
      // change a current character
    }
    return (
      <div>
        <div className='character-header'>
          <span character='character-header-label'>Select a Character:</span>
          <div className='character-header-selector'>
            <CharacterSelector
              characters={this.state.availableCharacters}
              onSelect={this.onCharacterSelected}
            />
          </div>
        </div>
        {editor}
      </div>
    );
  }
}

export default CharacterManagement;
