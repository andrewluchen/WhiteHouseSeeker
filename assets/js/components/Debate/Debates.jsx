import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import moment from 'moment';

class Debates extends React.Component {

  momentSort(left, right) {
    left = left.endtime;
    right = right.endtime;
    return moment(left).diff(moment(right))
  }

  render() {
    let debates = [];
    this.props.debates.slice(0).sort(this.momentSort).forEach(debate => {
      let time = moment(debate.endtime).fromNow();
      debates.push(
        <tr key={debate.debate_id}>
          <td>
            <Link to={'/debate/' + debate.debate_id}>
              {debate.title}
            </Link>
          </td>
          <td>Ends {time}</td>
        </tr>
      );
    })
    return (
      <div className='chamber-debates'>
        <div className='chamber-header'>Debate Floor</div>
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
