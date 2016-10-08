import React from 'react';
import { Link } from 'react-router';
import { ControlLabel } from 'react-bootstrap';

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

  partyColor(party) {
    if (party[0] === 'D') {
      return 'democratic';
    }
    if (party[0] === 'R') {
      return 'republican';
    }
    if (party[0] === 'I') {
      return 'independent';
    }
  }

  render() {
    let characters = [];
    this.state.characters.forEach(character => {
      characters.push(
        <Link
          key={character.character_id}
          className={this.partyColor(character.party)}
          to={'/character/' + character.character_id}
        >
          {character.name}
        </Link>
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
