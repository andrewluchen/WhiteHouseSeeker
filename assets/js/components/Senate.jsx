import React from 'react';

import ClerkOffice from './Bill/ClerkOffice';
import Debates from './Debate/Debates';
import Votes from './Vote/Votes';

class Senate extends React.Component {

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

  componentDidMount() {
    this.getClerk();
  }

  getClerk() {
    $.ajax({
      url: '/api/bills/',
      type: 'GET',
      data: {
        chamber: 'senate',
        status: 'Introduced'
      },
      success: response => {
        let clerk = []
        response.forEach(bill => {
          clerk.push({
            version_id: bill.id,
            bill_id: bill.bill_id,
            title: 'S.' + bill.bill_id + ' ' + bill.title,
            sponsor: bill.sponsor
          });
        });
        this.setState({
          clerk: clerk,
        });
      },
    });
  }

  getDebates() {

  }

  getVotes() {

  }

  render() {
    return (
      <div>
        <ClerkOffice
          name='Senate Clerk Office'
          newRoute='/senate/new'
          bills={this.state.clerk}
        />
        <Votes/>
        <Debates/>
      </div>
    );
  }
}

export default Senate;
