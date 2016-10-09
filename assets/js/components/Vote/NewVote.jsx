import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import moment from 'moment';

class NewVote extends React.Component {

  constructor() {
    super();
    this.state = {
      clerk: [],
      received: [],

      versionId: null,
      billId: null,
      hours: 72,
      title: '',
      sponsor: '',
    }
    this.fetchBills = this.fetchBills.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentDidMount() {
    this.fetchBills();
  }

  fetchBills() {
    $.ajax({
      url: '/api/bills/versions/',
      type: 'GET',
      data: {
        chamber: this.props.chamber,
        status: 'Introduced',
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
    $.ajax({
      url: '/api/bills/versions/',
      type: 'GET',
      data: {
        chamber: this.props.chamber,
        status: 'Received for Floor Consideration',
      },
      success: response => {
        let received = []
        response.forEach(bill => {
          received.push({
            versionId: bill.id,
            billId: bill.bill_id,
            title: bill.title,
            sponsor: bill.sponsor
          });
        });
        this.setState({
          received: received,
        });
      },
    });
  }

  startVote(bill) {
    this.setState({
      versionId: bill.versionId,
      billId: bill.billId,
      title: bill.title,
      sponsor: bill.sponsor,
    });
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  submitVote() {
    $.ajax({
      url: '/api/vote/new/',
      type: 'POST',
      data: {
        version_id: this.state.versionId,
        chamber: this.props.chamber,
        hours: this.state.hours,
      },
      success: response => {
        if (this.props.chamber === 'senate') {
          browserHistory.push('/' + this.props.chamber);
        } else if (this.props.chamber === 'house') {
          browserHistory.push('/' + this.props.chamber);
        }
      }
    });
  }

  render() {
    let voteCreator = null;
    let starttime = moment.utc();
    let endtime = moment(starttime).add(this.state.hours, 'hours');
    if (this.state.versionId && this.state.billId) {
      voteCreator = (
        <div className='newvote-header'>
          <div className='newvote-header-info'>
            <strong>Title:</strong> {this.state.title}<br/>
            <strong>Sponsor:</strong> {this.state.sponsor}<br/>
          </div>
          <div>
            <ButtonToolbar>
              <Button
                active={this.state.hours==24}
                onClick={() => this.setState({ hours: 24 })}
              >
                24 hours
              </Button>
              <Button
                active={this.state.hours==48}
                onClick={() => this.setState({ hours: 48 })}
              >
                48 hours
              </Button>
              <Button
                active={this.state.hours==72}
                onClick={() => this.setState({ hours: 72 })}
              >
                72 hours
              </Button>
              <Button
                active={this.state.hours==96}
                onClick={() => this.setState({ hours: 96 })}
              >
                96 hours
              </Button>
              <Button
                active={this.state.hours==120}
                onClick={() => this.setState({ hours: 120 })}
              >
                120 hours
              </Button>
              <Button
                active={this.state.hours==null}
                onClick={() => this.setState({ hours: null })}
              >
                No Deadline
              </Button>
              <Button bsStyle='primary' onClick={this.submitVote}>
                Start Vote
              </Button>
            </ButtonToolbar>
            <br/>
            <strong>Begin:</strong> {starttime.calendar()} UTC &nbsp;&nbsp;
            {this.state.hours ? <span><strong>Until:</strong> {endtime.calendar()} UTC</span> : null}
          </div>
        </div>
      );
    }

    let clerk = [];
    this.state.clerk.forEach(bill => {
      clerk.push(
        <tr key={bill.versionId}>
          <td>
            <Link to={'/bill/' + bill.billId + '/' + bill.versionId}>
              {bill.title}
            </Link>
          </td>
          <td>
            <a onClick={() => this.startVote(bill)}>
              Start Vote
            </a>
          </td>
        </tr>
      );
    })
    let received = [];
    this.state.received.forEach(bill => {
      received.push(
        <tr key={bill.versionId}>
          <td>
            <Link to={'/bill/' + bill.billId + '/' + bill.versionId}>
              {bill.title}
            </Link>
          </td>
          <td>
            <a onClick={() => this.startVote(bill)}>
              Start Vote
            </a>
          </td>
        </tr>
      );
    })
    return (
      <div>
        {voteCreator}
        <br/>
        <div className='chamber-header'>Received for Floor Consideration</div>
        <Table className='chamber-table' bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Bill</th>
              <th>Start Vote</th>
            </tr>
          </thead>
          <tbody>
            {received}
          </tbody>
        </Table>
        <div className='chamber-header'>Introduced</div>
        <Table className='chamber-table' bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Bill</th>
              <th>Start Vote</th>
            </tr>
          </thead>
          <tbody>
            {clerk}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default NewVote;
