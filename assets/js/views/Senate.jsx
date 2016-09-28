import React from 'react';

import ClerkOffice from '../components/Bill/ClerkOffice';
import Debates from '../components/Debate/Debates';
import Votes from '../components/Vote/Votes';

class Senate extends React.Component {

  render() {
    return (
      <div>
        <ClerkOffice name='Senate Clerk Office' newRoute='senate/new'/>
        <Votes/>
        <Debates/>
      </div>
    );
  }
}

export default Senate;
