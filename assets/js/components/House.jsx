import React from 'react';

import ClerkOffice from './Bill/ClerkOffice';
import Debates from './Debate/Debates';
import Votes from './Vote/Votes';

class House extends React.Component {

  render() {
    return (
      <div>
        <ClerkOffice name='House Hopper' newRoute='/house/new'/>
        <Votes/>
        <Debates/>
      </div>
    );
  }
}

export default House;
