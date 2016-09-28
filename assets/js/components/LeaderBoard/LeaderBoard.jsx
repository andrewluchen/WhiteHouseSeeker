import React from 'react';

class LeaderBoard extends React.Component {

  render() {
    let data = this.props.data;
    let i = 0;
    return (
      <div className='leaderboard'>
      {
        data.map(datum =>
          <div className='row' key={i++}>
            {
              datum.map(col =>
                <div className='col' key={i++}>{col ? col : 'None'}</div>
              )
            }
          </div>
        )
      }
      </div>
    );
  }
}

LeaderBoard.propTypes = {
  data: React.PropTypes.array,
}

export default LeaderBoard;
