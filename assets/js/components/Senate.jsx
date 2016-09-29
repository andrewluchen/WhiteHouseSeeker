import React from 'react';

import ClerkOffice from './Bill/ClerkOffice';
import Debates from './Debate/Debates';
import Votes from './Vote/Votes';

class Senate extends React.Component {

  render() {
    return (
      <div>
        <ClerkOffice name='Senate Clerk Office' newRoute='/senate/new'/>
        <Votes/>
        <Debates/>
      </div>
    );
  }
}

export default Senate;
