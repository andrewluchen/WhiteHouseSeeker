import React from 'react';
import ReactDOM from 'react-dom';
import { Col, Grid, Row } from 'react-bootstrap';
import { Button, ControlLabel } from 'react-bootstrap';

class CharacterSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar: props.data.avatar,
      name: props.data.name,
      birthday: props.data.birthday,
      gender: props.data.gender,
      residence: props.data.residence,
      state: props.data.state,
      party: props.data.party,
      bio: props.data.bio,
    };
  }

  componentWillReceiveProps(props) {
    this.state = {
      avatar: props.data.avatar,
      name: props.data.name,
      birthday: props.data.birthday,
      gender: props.data.gender,
      residence: props.data.residence,
      state: props.data.state,
      party: props.data.party,
      bio: props.data.bio,
    };
  }

  render() {
    return (
      <Grid fluid>
        <Row className='show-grid'>
          <Col xs={6} md={4}>
            <div className='character-avatar-container'>
              <img className='character-avatar' src={this.state.avatar} alt='avatar'/>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <div><ControlLabel>Name:</ControlLabel> {this.state.name}</div><br/>
            <div><ControlLabel>Date of Birth:</ControlLabel> {this.state.birthday}</div><br/>
            <div><ControlLabel>Gender:</ControlLabel> {this.state.gender}</div><br/>
            <div><ControlLabel>Residence:</ControlLabel> {this.state.residence}</div><br/>
            <div><ControlLabel>State:</ControlLabel> {this.state.state}</div><br/>
            <div><ControlLabel>Party:</ControlLabel> {this.state.party}</div><br/>
          </Col>
        </Row>

        <ControlLabel>Biography:</ControlLabel>
        <div>{this.state.bio}</div>
      </Grid>
    );
  }
}

CharacterSummary.propTypes = {
  data: React.PropTypes.object,
}

export default CharacterSummary;
