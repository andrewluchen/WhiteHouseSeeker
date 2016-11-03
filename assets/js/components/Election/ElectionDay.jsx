import React from 'react';
import { Button } from 'react-bootstrap';

import createCharacterLink from '../shared/createCharacterLink';

class ElectionDay extends React.Component {

  constructor() {
    super();
    this.state = {
      day: null,
    };
    this.fetchDay = this.fetchDay.bind(this);
    this.revealDay = this.revealDay.bind(this);
  }

  fetchDay() {
    $.ajax({
      url: '/api/election_day/' + this.props.day.id + '/',
      type: 'GET',
      success: response => {
        this.setState({
          day: response,
        });
      },
    });
  }

  revealDay() {
    $.ajax({
      url: '/api/election_day/' + this.props.day.id + '/',
      type: 'POST',
      data: {
        action: 'reveal_day',
      },
      success: response => {
        this.fetchDay();
      },
    });
  }

  render() {
    let day = this.state.day;
    if (day === null) {
      day = this.props.day;
    }
    if (!day.revealed) {
      return (
        <div className='election-day'>
          <div className='election-day-name'>Day {day.day}</div>
          <Button onClick={this.revealDay}>Reveal Day</Button>
        </div>
      );
    }
    let campaigns = [];
    day.campaigns.forEach(campaign => {
      campaigns.push(
        <div key={campaign.id} className='election-day-campaign'>
          {createCharacterLink(campaign.character.id, campaign.character.party, campaign.character.name)}
          <div
            className='preview'
            dangerouslySetInnerHTML={{__html: campaign.body}}
          />
        </div>
      );
    });
    return (
      <div className='election-day'>
        <div className='election-day-name'>Day {day.day}</div>
        {campaigns}
      </div>
    );
  }
}

ElectionDay.propTypes = {
  day: React.PropTypes.object,
};

export default ElectionDay;
