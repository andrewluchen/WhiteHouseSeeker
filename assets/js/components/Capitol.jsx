import React from 'react';

import LeaderBoard from './LeaderBoard/LeaderBoard';

const _test = [
  ['Speaker of the House', 'Mr. Speaker', 'Republican'],
  ['House Majority Leader', 'Mr. Majority', 'Republican'],
  ['House Majority Whip', 'Ms. Majority', 'Republican'],
  ['House Minority Leader', 'Mr. Minority', 'Democratic'],
  ['House Minority Whip', 'Ms. Minority', 'Democratic'],
  ['Senate Majority Leader', 'Mr. Majority', 'Republican'],
  ['Senate Majority Whip', 'Ms. Majority', 'Republican'],
  ['Senate Minority Leader', 'Mr. Minority', 'Democratic'],
  ['Senate Minority Whip', 'Ms. Minority', 'Democratic'],
]

class Capitol extends React.Component {

  constructor() {
    super();
    this.state = {
      leadership: [],
    }
  }

  componentDidMount() {
    $.get('api/capitol/', function (data) {
      let fields = data[0].fields;
      this.setState({
        leadership: [
          ['President', fields.potus],
          ['Vice President', fields.vpotus],
          ['Speaker of the House', fields.speaker],
          ['Senate Majority Leader', fields.housemajorityleader],
          ['Senate Majority Whip', fields.senatemajoritywhip],
          ['Senate Minority Leader', fields.senateminorityleader],
          ['Senate Minority Whip', fields.senateminoritywhip],
          ['House Majority Leader', fields.housemajorityleader],
          ['House Majority Whip', fields.housemajoritywhip],
          ['House Minority Leader', fields.houseminorityleader],
          ['House Minority Whip', fields.houseminoritywhip],
        ],
      });
    }.bind(this));
  }

  render() {
    return (
      <div>
        <LeaderBoard data={this.state.leadership}/>
      </div>
    );
  }
}

export default Capitol;
