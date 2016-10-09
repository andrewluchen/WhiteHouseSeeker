import React from 'react';

import ClerkOffice from './Bill/ClerkOffice';
import Debates from './Debate/Debates';
import Votes from './Vote/Votes';

class House extends React.Component {

  constructor() {
    super();
    this.chamber = 'senate';
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
      url: '/api/bills/versions/',
      type: 'GET',
      data: {
        chamber: this.chamber,
        status: 'Introduced',
        active: true,
      },
      success: response => {
        let clerk = []
        response.forEach(bill => {
          clerk.push({
            versionId: bill.id,
            billId: bill.bill_id,
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
        chamber: this.chamber,
        active: true,
      },
      success: response => {
        let debates = []
        response.forEach(debate => {
          debates.push({
            debateId: debate.id,
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
        chamber: this.chamber,
        active: true,
      },
      success: response => {
        let votes = []
        response.forEach(vote => {
          votes.push({
            voteId: vote.id,
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
          name='House Hopper'
          newRoute='/house/new'
          bills={this.state.clerk}
        />
      </div>
    );
  }
}

export default House;
