import React from 'react';
import { Link } from 'react-router';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

import partyColor from '../shared/partyColor';

class Election extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      electionId: props.params.electionId,
      started: false,
      candidates: [],
      days: [],
      description: '',
      summary: '',
    };
    this.fetchElection = this.fetchElection.bind(this);
    this.startElection = this.startElection.bind(this);
    this.addDay = this.addDay.bind(this);
    this.declareWinner = this.declareWinner.bind(this);
  }

  componentDidMount() {
    this.fetchElection(this.props.params.electionId);
  }

  fetchElection(electionId) {
    $.ajax({
      url: '/api/election/' + electionId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          started: !response.can_file,
          candidates: response.candidates,
          days: response.days,
          description: response.description,
          summary: response.summary,
        });
      },
    });
  }

  startElection() {
    $.ajax({
      url: '/api/election/' + this.props.params.electionId + '/',
      type: 'POST',
      data: {
        action: 'start-general',
      },
      success: response => {
        this.fetchElection(this.props.params.electionId);
      },
    });
  }

  addDay() {
    $.ajax({
      url: '/api/election/' + this.props.params.electionId + '/',
      type: 'POST',
      data: {
        action: 'add-day',
      },
      success: response => {
        this.fetchElection(this.props.params.electionId);
      },
    });
  }

  declareWinner(characterId) {
    $.ajax({
      url: '/api/election/' + this.props.params.electionId + '/',
      type: 'POST',
      data: {
        action: 'declare-winner',
        character_id: characterId,
      },
      success: response => {
        this.fetchElection(this.props.params.electionId);
      },
    });
  }

  render() {
    if (!this.state.started) {
      return (
        <div>
          <div className='election-title'>{this.state.description}</div>
          <Button onClick={this.startElection}>Start General Election</Button>
        </div>
      );
    }
    let candidates = this.state.candidates.filter(c => !c.withdrawn);
    let candidateViews = [];
    let candidateButtons = [];
    for (let i = 0; i < candidates.length; i++) {
      let candidate = candidates[i];
      candidateViews.push(
        <span>
          {i === 0 ? null : <span>&nbsp;v.&nbsp;</span>}
          <Link
            key={candidate.campaign_id}
            to={'/campaign/' + candidate.campaign_id}
            className={partyColor(candidate.character.party)}
          >
            {candidate.character.name}
          </Link>
        </span>
      );
      candidateButtons.push(
        <MenuItem eventKey={i} onClick={() => this.declareWinner(candidate.character.id)}>
          {candidate.character.name}
        </MenuItem>
      )
    }
    return (
      <div>
        <div className='election-title'>{this.state.description}</div>
        <br/>
        <div className='election-candidates'>{candidateViews}</div>
        <br/>
        <div className='election-summary'>
          Latest Results: {this.state.summary}
        </div>
        <br/>
        <Button onClick={this.addDay}>Add Day</Button>: {this.state.days.length}
        <br/>
        <div>
          <DropdownButton title='Declare Winner' id='dropdown-basic'>
            {candidateButtons}
          </DropdownButton>
        </div>
      </div>
    );
  }
}

export default Election;
