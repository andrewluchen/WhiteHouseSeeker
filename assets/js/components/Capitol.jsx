import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';

import LeaderBoard from './LeaderBoard/LeaderBoard';
import SenateMap from './Datamap/SenateMap';
import SortableTable from './SortableTable/SortableTable';

class Capitol extends React.Component {

  constructor() {
    super();
    this.state = {
      leadership: [],
      senators: [],
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
          senators: response.senators,
        });
      },
    );
  }

  render() {
    let headers = [
      { name: 'state', width: 50 },
      { name: 'party', width: 200 },
      { name: 'name', width: 300 },
    ];
    let data = [];
    this.state.senators.forEach(senator => {
      data.push({
        id: senator.id,
        name: senator.name,
        state: senator.state,
        party: senator.party,
      });
    });
    return (
      <div>
        <LeaderBoard data={this.state.leadership}/>
        <div className='capitol-header'>Senate Map:</div>
        <SenateMap/>
        <div className='capitol-header'>Senators:</div>
        <div>
          <SortableTable
            headers={headers}
            data={data}
          />
        </div>
      </div>
    );
  }
}

export default Capitol;
