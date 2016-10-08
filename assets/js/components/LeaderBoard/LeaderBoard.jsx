import React from 'react';
import { Table } from 'react-bootstrap';

class LeaderBoard extends React.Component {

  render() {
    let data = this.props.data;
    let i = 0;
    return (
      <Table className='leaderboard' bordered={true} striped={true}>
        <thead>
        </thead>
        <tbody>
          {
            data.map(datum =>
              <tr key={datum[0]}>
                <td>
                  {datum[0]}
                </td>
                <td>
                  {datum[1]}
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>
    );
  }
}

LeaderBoard.propTypes = {
  data: React.PropTypes.array,
}

export default LeaderBoard;
