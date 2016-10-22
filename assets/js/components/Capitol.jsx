import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';

import LeaderBoard from './LeaderBoard/LeaderBoard';
import SenateMap from './Datamap/SenateMap';
import SortableTable from './SortableTable/SortableTable';
import createCharacterLink from './shared/createCharacterLink';
import partyColor from './shared/partyColor';

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
      { name: 'state', width: 70 },
      { name: 'party', width: 200 },
      { name: 'name', width: 350 },
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
    let createCellContent = (header, data) => {
      if (header === 'name') {
        return createCharacterLink(data.id, data.party, data.name);
      } else if (header === 'party') {
        return (
          <div className={partyColor(data.party)}>{data.party}</div>
        );
      } else {
        return data[header];
      }
    };
    return (
      <div className='capitol'>
        <LeaderBoard data={this.state.leadership}/>
        <div className='capitol-header'>Senate Map:</div>
        <SenateMap/>
        <div className='capitol-header'>Senators:</div>
        <SortableTable
          headers={headers}
          data={data}
          createCellContent={createCellContent}
        />
      </div>
    );
  }
}

export default Capitol;
