import React from 'react';

import CharacterStore from '../stores/CharacterStore';

import CharacterSelector from './Character/CharacterSelector';
import CharacterEditor from './Character/CharacterEditor';

class CharacterManagement extends React.Component {

  constructor() {
    super();
    this.state = {
      character: CharacterStore.getActive(),
      availableCharacters: CharacterStore.getCharacters(),
    }
    this.onCharacterSelected = this.onCharacterSelected.bind(this);
  }

  componentDidMount() {
    this.changeListener = this.onChange.bind(this);
    CharacterStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    CharacterStore.removeChangeListener(this.changeListener);
  }

  onChange() {
    this.setState({
      availableCharacters: CharacterStore.getCharacters(),
    });
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
          <span>Select a Character:</span>
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
