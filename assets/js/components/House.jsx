import React from 'react';

import ClerkOffice from './Bill/ClerkOffice';
import Debates from './Debate/Debates';
import Votes from './Vote/Votes';

class House extends React.Component {

  constructor() {
    super();
    this.state = {
      clerk: [],
      debates: [],
      votes: [],
    };
    this.getClerk = this.getClerk.bind(this);
    this.getDebates = this.getDebates.bind(this);
    this.getVotes = this.getVotes.bind(this);
  }

  getClerk() {

  }

  getDebates() {

  }

  getVotes() {

  }

  render() {
    return (
      <div>
        <ClerkOffice
          name='House Hopper'
          newRoute='/house/new'
          bills={this.state.clerk}
        />
      </div>
    );
  }
}

export default House;
