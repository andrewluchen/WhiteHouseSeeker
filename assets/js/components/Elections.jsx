import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Table, ControlLabel, FormControl, Button } from 'react-bootstrap';

import createCharacterLink from './shared/createCharacterLink';

class Elections extends React.Component {

  constructor() {
    super();
    this.state = {
      elections: [],
    };
    this.fetchElections = this.fetchElections.bind(this);
    this.createElection = this.createElection.bind(this);
    this.getElections = this.getElections.bind(this);
    this.fileElection = this.fileElection.bind(this);
  }

  componentDidMount() {
    this.fetchElections();
  }

  fetchElections() {
    $.ajax({
      url: '/api/elections/',
      type: 'GET',
      data: {
        active: true
      },
      success: response => {
        this.setState({
          elections: response,
        });
      },
    });
  }

  createElection() {
    $.ajax({
      url: '/api/election/new/',
      type: 'POST',
      data: {
        description: ReactDOM.findDOMNode(this.refs.description).value,
        year: ReactDOM.findDOMNode(this.refs.year).value,
      },
      success: () => {
        this.fetchElections();
      },
    });
  }

  getElections() {
    let elections = [];
    this.state.elections.forEach(election => {
      if (true) {
        elections.push(
          <option key={election.id} value={election.id}>{election.description}</option>
        );
      }
    })
    return (
      <div className='elections-header'>
        <ControlLabel>File Candidacy:</ControlLabel>
        <FormControl ref='election' componentClass='select'>
          {elections}
        </FormControl>
        <ControlLabel>Campaign Name:</ControlLabel>
        <FormControl ref='campaign' type='text'/>
        <Button onClick={this.fileElection}>
          File
        </Button>
      </div>
    );
  }

  fileElection() {
    let electionId = ReactDOM.findDOMNode(this.refs.election).value
    $.ajax({
      url: '/api/election/' + electionId + '/',
      type: 'POST',
      data: {
        action: 'file-candidate',
        character_id: this.props.active,
        campaign_name: ReactDOM.findDOMNode(this.refs.campaign).value
      },
      success: () => {
        this.fetchElections();
      },
    });
  }

  render() {
    let elections = [];
    this.state.elections.forEach(election => {
      let democrats = [];
      let republicans = [];
      election.candidates.forEach(candidate => {
        if (candidate.user_id) {
          let withdrawStyle = candidate.withdrawn ? {textDecoration: 'line-through'} : {};
          let link = (
            <div key={candidate.campaign_id}>
              <Link
                className={candidate.character.party}
                to={'/campaign/' + candidate.campaign_id}
                style={withdrawStyle}
              >
                {candidate.character.name + ' [' + candidate.user_username + ']'}
              </Link>
            </div>
          );
          if (candidate.character.party.includes('Democratic')) {
            democrats.push(link);
          } else if (candidate.character.party.includes('Republican')) {
            republicans.push(link);
          }
        } else {
          if (candidate.character.party.includes('Democratic')) {
            democrats.push(<div className={candidate.party}>{candidate.name}</div>);
          } else if (candidate.character.party.includes('Republican')) {
            republicans.push(<div className={candidate.party}>{candidate.name}</div>);
          }
        }
      });
      elections.push(
        <tr key={election.id}>
          <td>
            <Link to={'/election/' + election.id}>
              {election.description + ' (' + election.year + ')'}
            </Link>
          </td>
          <td>{democrats}</td>
          <td>{republicans}</td>
        </tr>
      );
    })
    return (
      <div>
        <div className='elections-header'>
          <ControlLabel>Create New Election:</ControlLabel>
          <FormControl ref='description' type='text'/>
          <ControlLabel>Year:</ControlLabel>
          <FormControl ref='year' type='text'/>
          <Button onClick={this.createElection}>Create</Button>
        </div>
        {this.getElections()}
        <Table className='usgs-table' bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Election</th>
              <th>Democratic Candidates</th>
              <th>Republican Candidates</th>
            </tr>
          </thead>
          <tbody>
            {elections}
          </tbody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    characters: state.characters.characters,
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Elections);
