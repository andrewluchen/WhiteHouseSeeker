import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import moment from 'moment';

class Votes extends React.Component {

  momentSort(left, right) {
    left = left.endtime;
    right = right.endtime;
    return moment(left).diff(moment(right))
  }

  render() {
    let votes = [];
    this.props.votes.slice(0).sort(this.momentSort).forEach(vote => {
      let time = moment(vote.endtime).fromNow();
      let timeleft = 'No time limit';
      if (vote.endtime) {
        let endtime = moment(vote.endtime);
        timeleft = 'Ends ' + moment(vote.endtime).fromNow();
        if (moment().diff(endtime) > 0) {
          timeleft = 'Ended ' + moment(vote.endtime).fromNow();
        }
      }
      votes.push(
        <tr key={vote.voteId}>
          <td>
            <Link to={'/vote/' + vote.voteId}>
              {vote.title}
            </Link>
          </td>
          <td>
            ({vote.yeas.length}-{vote.nays.length}-{vote.pres.length})
          </td>
          <td>{timeleft}</td>
        </tr>
      );
    })
    return (
      <div className='chamber-votes'>
        <div className='chamber-header'>Roll Call Vote</div>
        <div className='chamber-cornerlink'>
          <Link to={this.props.newRoute}>+ New Vote (skip debate)</Link>
        </div>
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Vote</th>
              <th>Status (Yea/Nay/Present)</th>
              <th>Ending</th>
            </tr>
          </thead>
          <tbody>
            {votes}
          </tbody>
        </Table>
      </div>
    );
  }
}

Votes.propTypes = {
  votes: React.PropTypes.array,
}

export default Votes;
