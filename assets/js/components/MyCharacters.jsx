import React from 'react';
import { connect } from 'react-redux';

import { createCharacter } from '../actions/CharacterActions';

import CharacterSelector from './Character/CharacterSelector';
import CharacterEditor from './Character/CharacterEditor';

class MyCharacters extends React.Component {

  constructor() {
    super();
    this.state = {
      character: null,
    };
    this.createCharacter = this.createCharacter.bind(this);
    this.onCharacterSelected = this.onCharacterSelected.bind(this);
  }

  createCharacter(data) {
    if (this.props.characters.length === 0) {
      data['primary'] = true;
    } else {
      data['primary'] = false;
    }
    this.props.createCharacter(data);
  }

  onCharacterSelected(characterID) {
    $.get('api/charater/' + characterID + '/', function (data) {

    })
  }

  render() {
    let editor = <CharacterEditor onSave={this.createCharacter}/>
    if (false) {
      // change a current character
    }
    return (
      <div>
        <div className='character-header'>
          <span className='character-header-label'>Select a Character:</span>
          <div className='character-header-selector'>
            <CharacterSelector
              characters={this.props.characters}
              onSelect={this.onCharacterSelected}
            />
          </div>
        </div>
        {editor}
      </div>
    );
  }
}

MyCharacters.propTypes = {
  characters: React.PropTypes.array,
  createCharacter: React.PropTypes.func,
}

function mapStateToProps(state) {
  return {
    characters: state.characters.characters,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createCharacter: data => dispatch(createCharacter(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCharacters);
