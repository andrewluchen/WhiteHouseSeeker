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
      votes.push(
        <tr key={vote.vote_id}>
          <td>
            <Link to={'/vote/' + vote.vote_id}>
              {vote.title}
            </Link>
          </td>
          <td>
            ({vote.yeas}-{vote.nays}-{vote.pres})
          </td>
          <td>Ends {time}</td>
        </tr>
      );
    })
    return (
      <div className='chamber-votes'>
        <div className='chamber-header'>Roll Call Vote</div>
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Vote</th>
              <th>Status</th>
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
