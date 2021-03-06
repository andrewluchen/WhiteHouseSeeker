import React from 'react';
import { connect } from 'react-redux';

import { createCharacter, updateCharacter, retireCharacter } from '../../actions/CharacterActions';

import CharacterSelector from './CharacterSelector';
import CharacterEditor from './CharacterEditor';
import LoggedInPermission from '../Permission/LoggedInPermission';

class MyCharacters extends React.Component {

  constructor() {
    super();
    this.state = {
      active: 0,
      data: {},
    };
    this.createCharacter = this.createCharacter.bind(this);
    this.updateCharacter = this.updateCharacter.bind(this);
    this.retireCharacter = this.retireCharacter.bind(this);
    this.onCharacterSelected = this.onCharacterSelected.bind(this);
  }

  createCharacter(data) {
    if (this.props.characters.length === 0) {
      data['primary'] = true;
    } else {
      data['primary'] = false;
    }
    this.props.createCharacter([this.props.user.username, data]);
  }

  updateCharacter(data) {
    this.props.updateCharacter([this.props.user.username, this.state.active, data]);
  }

  retireCharacter() {
    this.props.retireCharacter([this.props.user.username, this.state.active]);
    this.setState({
      active: 0,
    });
  }

  onCharacterSelected(characterID) {
    if (characterID === 0) {
      this.setState({
        active: characterID,
        data: {},
      });
    } else {
      $.ajax({
        url: '/api/character/' + characterID + '/',
        type: 'GET',
        success: response => {
          this.setState({
            active: characterID,
            data: response,
          });
        },
      });
    }
  }

  render() {
    let allowSenator = true;
    let partyOption = null;
    this.props.characters.forEach(character => {
      if (character.party.indexOf('Democratic') !== -1) {
        partyOption = 'Democratic';
      }
      if (character.party.indexOf('Republican') !== -1) {
        partyOption = 'Republican';
      }
      if (character.titles.includes('Senator')) {
        allowSenator = false;
      }
    });
    let editor = (
      <CharacterEditor
        data={{}}
        onSave={data => this.createCharacter(data)}
        senatorOption={allowSenator}
        partyOption={partyOption}
      />
    );
    if (this.state.active !== 0) {
      editor = (
        <CharacterEditor
          data={this.state.data}
          onSave={data => this.updateCharacter(data)}
          onRetire={this.retireCharacter}
          senatorOption={allowSenator}
          partyOption={partyOption}
        />
      );
    }
    return (
      <LoggedInPermission substitute='You must be logged in to create a character.'>
        <div className='character-header'>
          <span className='character-header-label'>Select a Character:</span>
          <div className='character-header-selector'>
            <CharacterSelector
              characters={this.props.characters}
              active={this.state.active}
              onSelect={this.onCharacterSelected}
              newOption={true}
            />
          </div>
        </div>
        {editor}
      </LoggedInPermission>
    );
  }
}

MyCharacters.propTypes = {
  user: React.PropTypes.object,
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
  createCharacter: React.PropTypes.func,
  updateCharacter: React.PropTypes.func,
  retireCharacter: React.PropTypes.func,
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    characters: state.characters.characters,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createCharacter: args => dispatch(createCharacter(...args)),
    updateCharacter: args => dispatch(updateCharacter(...args)),
    retireCharacter: args => dispatch(retireCharacter(...args)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCharacters);
