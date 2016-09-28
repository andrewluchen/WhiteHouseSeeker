import React from 'react';

import ClerkOffice from '../components/Bill/ClerkOffice';
import Debates from '../components/Debate/Debates';
import Votes from '../components/Vote/Votes';

class House extends React.Component {

  render() {
    return (
      <div>
        <ClerkOffice name='House Hopper' newRoute='house/new'/>
        <Votes/>
        <Debates/>
      </div>
    );
  }
}

export default House;
