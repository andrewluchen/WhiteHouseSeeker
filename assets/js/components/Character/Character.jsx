import React from 'react';
import { Link } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';

import CharacterSummary from './CharacterSummary';
import VotingRecord from './VotingRecord';

class Character extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userId: '',
      characterId: props.params.characterId,
      characterSummary: {},
      sponsored: [],
      cosponsored: [],
      yeas: [],
      nays: [],
      pres: [],
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
          username: response.username,
          userId: response.user_id,
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
    $.get(
      '/api/character/' + characterId + '/votes/',
      response => {
        this.setState({
          yeas: response.yeas,
          nays: response.nays,
          pres: response.pres,
          sponsored: response.sponsored,
          cosponsored: response.cosponsored,
        })
      },
    );
  }

  render() {
    return (
      <div>
        <div>
          <strong>User: </strong>
          <Link to={'/user/' + this.state.userId}>{this.state.username}</Link>
        </div><br/>
        <Tabs>
          <Tab label='Character Summary'>
            <CharacterSummary data={this.state.characterSummary}/>
          </Tab>
          <Tab label='Electoral History'>
            TODO: implement me
          </Tab>
          <Tab label='Voting Record'>
            <VotingRecord
              yeas={this.state.yeas}
              nays={this.state.nays}
              pres={this.state.pres}
              sponsored={this.state.sponsored}
              cosponsored={this.state.cosponsored}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Character;
