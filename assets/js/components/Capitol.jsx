import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import LeaderBoard from './LeaderBoard/LeaderBoard';
import SenateMap from './Datamap/SenateMap';

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
    $.get(
      'api/capitol/',
      response => {
        this.setState({
          leadership: [
            ['President', response.potus],
            ['Vice President', response.vpotus],
            ['Speaker of the House', response.speaker],
            ['Senate Majority Leader', response.housemajorityleader],
            ['Senate Majority Whip', response.senatemajoritywhip],
            ['Senate Minority Leader', response.senateminorityleader],
            ['Senate Minority Whip', response.senateminoritywhip],
            ['House Majority Leader', response.housemajorityleader],
            ['House Majority Whip', response.housemajoritywhip],
            ['House Minority Leader', response.houseminorityleader],
            ['House Minority Whip', response.houseminoritywhip],
          ],
        });
      },
    );
  }

  render() {
    return (
      <div>
        <LeaderBoard data={this.state.leadership}/>
        <div className='capitol-header'>Senate Map:</div>
        <SenateMap/>
        <div className='capitol-header'>Senators:</div>
      </div>
    );
  }
}

export default Capitol;
