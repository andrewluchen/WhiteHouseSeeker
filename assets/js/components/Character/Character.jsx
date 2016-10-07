import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import CharacterSummary from './CharacterSummary';
import VotingRecord from './VotingRecord';

class Character extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      characterId: props.params.characterId,
      characterSummary: {},
    };
    this.fetchCharacter = this.fetchCharacter.bind(this);
  }

  componentDidMount() {
    this.fetchCharacter(this.props.params.characterId);
  }

  fetchCharacter(characterId) {
    $.get(
      '/api/character/' + characterId + '/',
      response => {
        if (response.gender === 'M') {
          response.gender = 'Male'
        } else if (response.gender === 'F') {
          response.gender = 'Female'
        } else {
          response.gender = 'A Mystery';
        }
        this.setState({
          characterSummary: {
            avatar: response.avatar,
            name: response.name,
            birthday: response.birthday,
            gender: response.gender,
            residence: response.residence,
            state: response.state,
            party: response.party,
            bio: response.bio,
          },
        });
      },
    );
  }

  render() {
    return (
      <Tabs>
        <Tab label='Character Summary'>
          <CharacterSummary data={this.state.characterSummary}/>
        </Tab>
        <Tab label='Voting Record'>
          <VotingRecord data={{}}/>
        </Tab>
      </Tabs>
    );
  }
}

export default Character;
