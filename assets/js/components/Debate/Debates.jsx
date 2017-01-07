import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import moment from 'moment';

class Debates extends React.Component {

  momentSort(left, right) {
    left = left.endtime ? left.endtime : moment();
    right = right.endtime ? right.endtime : moment();
    return moment(left).diff(moment(right));
  }

  render() {
    let debates = [];
    this.props.debates.slice(0).sort(this.momentSort).forEach(debate => {
      let timeleft = 'No time limit';
      if (debate.endtime) {
        let endtime = moment(debate.endtime);
        timeleft = 'Ends ' + moment(debate.endtime).fromNow();
        if (moment().diff(endtime) > 0) {
          timeleft = 'Ended ' + moment(debate.endtime).fromNow();
        }
      }
      debates.push(
        <tr key={debate.debateId}>
          <td>
            <Link to={'/debate/' + debate.debateId}>
              {debate.title}
            </Link>
          </td>
          <td>{timeleft}</td>
        </tr>
      );
    })
    return (
      <div className='chamber-debates'>
        <div className='chamber-header'>Debate Floor</div>
        <div className='chamber-cornerlink'>
          <Link to={this.props.newRoute}>+ New Debate</Link>
        </div>
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Debate</th>
              <th>Ending</th>
            </tr>
          </thead>
          <tbody>
            {debates}
          </tbody>
        </Table>
      </div>
    );
  }
}

Debates.propTypes = {
  debates: React.PropTypes.array,
}

export default Debates;
