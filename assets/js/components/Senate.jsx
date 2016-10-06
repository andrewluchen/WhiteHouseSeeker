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
    this.getVotes();
    this.getDebates();
  }

  getClerk() {
    $.ajax({
      url: '/api/clerk/',
      type: 'GET',
      data: {
        chamber: 'senate',
        status: 'Introduced',
      },
      success: response => {
        let clerk = []
        response.forEach(bill => {
          clerk.push({
            version_id: bill.id,
            bill_id: bill.bill_id,
            title: bill.title,
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
    $.ajax({
      url: '/api/debates/',
      type: 'GET',
      data: {
        chamber: 'senate',
        active: true,
      },
      success: response => {
        let debates = []
        response.forEach(debate => {
          debates.push({
            debate_id: debate.id,
            title: debate.title,
            endtime: debate.endtime,
          });
        });
        this.setState({
          debates: debates,
        });
      },
    });
  }

  getVotes() {
    $.ajax({
      url: '/api/votes/',
      type: 'GET',
      data: {
        chamber: 'senate',
        active: true,
      },
      success: response => {
        let votes = []
        response.forEach(vote => {
          votes.push({
            vote_id: vote.id,
            title: vote.title,
            endtime: vote.endtime,
            yeas: vote.yeas,
            nays: vote.nays,
            pres: vote.pres,
          });
        });
        this.setState({
          votes: votes,
        });
      },
    });
  }

  render() {
    return (
      <div>
        <Votes votes={this.state.votes}/>
        <Debates debates={this.state.debates}/>
        <ClerkOffice
          name='Senate Clerk Office'
          newRoute='/senate/new'
          bills={this.state.clerk}
        />
      </div>
    );
  }
}

export default Senate;
