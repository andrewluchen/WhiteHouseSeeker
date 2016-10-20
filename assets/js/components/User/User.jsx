import React from 'react';
import { Link } from 'react-router';
import { ControlLabel } from 'react-bootstrap';

import createCharacterLink from '../shared/createCharacterLink';

class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      characters: [],
    };
    this.fetchUser = this.fetchUser.bind(this);
  }

  componentDidMount() {
    this.fetchUser(this.props.params.userId);
  }

  fetchUser(userId) {
    $.get(
      '/api/user/' + userId + '/',
      response => {
        this.setState({
          username: response.username,
          characters: response.characters,
        });
      },
    );
  }

  render() {
    let characters = [];
    this.state.characters.forEach(character => {
      characters.push(
        <div key={character.character_id}>
          {createCharacterLink(character.character_id, character.party, character.name)}
        </div>
      );
    })
    return (
      <div>
        <div><ControlLabel>Name:</ControlLabel> {this.state.username}</div><br/>
        <div><ControlLabel>Characters:</ControlLabel></div>
        {characters}
      </div>
    );
  }
}

export default User;
