import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, ControlLabel, FormControl, Grid, Row } from 'react-bootstrap';

import { STATES, } from '../../StateConstants';

class CharacterEditor extends React.Component {

  constructor() {
    super();
    this.state = {
      party: 'Independent',
    }
    this.saveCharacter = this.saveCharacter.bind(this);
    this.setParty = this.setParty.bind(this);
    this.rand = Math.random();
  }

  saveCharacter() {
    $.ajax({
      url: this.props.endpoint,
      type: this.props.verb,
      data: {
        name: ReactDOM.findDOMNode(this.refs.name).value,
        birthday: ReactDOM.findDOMNode(this.refs.birthday).value,
        residence: ReactDOM.findDOMNode(this.refs.residence).value,
        state: ReactDOM.findDOMNode(this.refs.state).value,
        party: ReactDOM.findDOMNode(this.refs.party).value,
        bio: ReactDOM.findDOMNode(this.refs.bio).value,
      },
      success: function (data) {

      },
      error: function (data) {

      },
    });
  }

  setParty(event) {
    this.setState({
      party: event.target.value,
    });
  }

  render() {
    let stateOptions = []
    for (let key in STATES){
      stateOptions.push(
        <option value={STATES[key]} key={key}>{key + ' (' + STATES[key] + ')'}</option>
      );
    }
    let cn = this.state.party.toLowerCase().split(' ')[0];
    let parties = (
      <FormControl className={cn} ref='party' componentClass='select' value={this.state.party} onChange={this.setParty}>
        <option className='democratic' value='Democratic'>Democratic</option>
        <option className='republican' value='Republican'>Republican</option>
        <option className='independent' value='Independent Democratic'>Independent (Caucus with Democrats)</option>
        <option className='independent' value='Independent Republican'>Independent (Caucus with Republicans)</option>
        <option className='media' value='Media'>The Fourth Estate</option>
      </FormControl>
    );
    if (this.rand > 0.5) {
      parties =
      (
        <FormControl className={cn} ref='party' componentClass='select' value={this.state.party} onChange={this.setParty}>
          <option className='republican' value='Republican'>Republican</option>
          <option className='democratic' value='Democratic'>Democratic</option>
          <option className='independent' value='Independent Republican'>Independent (Caucus with Republicans)</option>
          <option className='independent' value='Independent Democratic'>Independent (Caucus with Democrats)</option>
          <option className='media' value='Media'>The Fourth Estate</option>
        </FormControl>
      );
    }
    return (
      <Grid fluid>
        <form ref='form'>
          <Row className='show-grid'>
            <Col xs={6} md={4}>
              <div className='character-avatar'>
                Character Image
              </div>
            </Col>
            <Col xs={12} md={8}>
              <ControlLabel>Name:</ControlLabel>
              <FormControl ref='name' type='text'/>

              <ControlLabel>Date of Birth:</ControlLabel>
              <FormControl ref='birthday' type='text' placeholder='MM/DD/YYYY'/>

              <ControlLabel>Residence:</ControlLabel>
              <FormControl ref='residence' type='text'/>

              <ControlLabel>State:</ControlLabel>
              <FormControl ref='state' componentClass='select'>
                {stateOptions}
              </FormControl>

              <ControlLabel>Party (all your characters must be from the same party):</ControlLabel>
              {parties}
            </Col>
          </Row>

          <ControlLabel>Biography:</ControlLabel>
          <FormControl ref='bio' componentClass='textarea'/>

          <div className='character-buttons'>
            <Button
              bsStyle='success'
              bsSize='large'
            >
              Make Primary
            </Button>
            <Button
              bsStyle='danger'
              bsSize='large'
            >
              Delete
            </Button>
            <Button
              bsStyle='primary'
              bsSize='large'
              onClick={this.saveCharacter}
            >
              Save
            </Button>
          </div>
        </form>
      </Grid>
    );
  }
}

CharacterEditor.propTypes = {
  endpoint: React.PropTypes.string,
  verb: React.PropTypes.string,
  data: React.PropTypes.object,
}

export default CharacterEditor;
