import React from 'react';
import ReactDOM from 'react-dom';
import { Col, Grid, Row } from 'react-bootstrap';
import { Button, ControlLabel, FormControl, Radio } from 'react-bootstrap';

import { STATES } from '../../StateConstants';

class CharacterEditor extends React.Component {

  constructor() {
    super();
    this.rand = Math.random();
    this.randState = STATES[
      Object.keys(STATES)[Math.floor(this.rand * Object.keys(STATES).length)]
    ];
    this.state = {
      name: '',
      birthday: '',
      gender: this.rand > 0.5 ? 'M' : 'F',
      residence: '',
      state: this.randState,
      party: this.rand > 0.5 ? 'Republican' : 'Democratic',
      avatar: '',
      bio: '',
    }
    this.saveCharacter = this.saveCharacter.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  saveCharacter() {
    this.props.onSave({
     name: this.state.name,
     birthday: this.state.birthday,
     gender: this.state.gender,
     residence: this.state.residence,
     state: this.state.state,
     party: this.state.party,
     avatar: this.state.avatar,
     bio: this.state.bio,
   });
  }

  onChange(event) {
    this.setState({
     name: ReactDOM.findDOMNode(this.refs.name).value,
     birthday: ReactDOM.findDOMNode(this.refs.birthday).value,
     residence: ReactDOM.findDOMNode(this.refs.residence).value,
     state: ReactDOM.findDOMNode(this.refs.state).value,
     party: ReactDOM.findDOMNode(this.refs.party).value,
     avatar: ReactDOM.findDOMNode(this.refs.avatar).value,
     bio: ReactDOM.findDOMNode(this.refs.bio).value,
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
      <FormControl ref='party' className={cn} componentClass='select' value={this.state.party} onChange={this.onChange}>
        <option className='democratic' value='Democratic'>Democratic</option>
        <option className='republican' value='Republican'>Republican</option>
        <option className='independent' value='Independent Democratic'>Independent (Caucus with Democrats)</option>
        <option className='independent' value='Independent Republican'>Independent (Caucus with Republicans)</option>
        <option className='fourthestate' value='Media'>The Fourth Estate</option>
      </FormControl>
    );
    if (this.rand > 0.5) {
      parties =
      (
        <FormControl ref='party' className={cn} componentClass='select' value={this.state.party} onChange={this.onChange}>
          <option className='republican' value='Republican'>Republican</option>
          <option className='democratic' value='Democratic'>Democratic</option>
          <option className='independent' value='Independent Republican'>Independent (Caucus with Republicans)</option>
          <option className='independent' value='Independent Democratic'>Independent (Caucus with Democrats)</option>
          <option className='fourthestate' value='Media'>The Fourth Estate</option>
        </FormControl>
      );
    }
    return (
      <Grid fluid>
        <form className='character'>
          <Row className='show-grid'>
            <Col xs={6} md={4}>
              <div className='character-avatar-container'>
                <img className='character-avatar' src={this.state.avatar} alt='avatar'/><br/><br/>
                Image URL: <FormControl ref='avatar' value={this.state.avatar} onChange={this.onChange} type='text'/>
              </div>
            </Col>
            <Col xs={12} md={8}>
              <ControlLabel>Name:</ControlLabel>
              <FormControl ref='name' value={this.state.name} onChange={this.onChange} type='text'/>

              <ControlLabel>Date of Birth:</ControlLabel>
              <FormControl ref='birthday' value={this.state.birthday} onChange={this.onChange} type='text' placeholder='MM/DD/YYYY'/>

              <ControlLabel>Gender:</ControlLabel><br/>
              <Radio checked={this.state.gender === 'M'} onChange={() => this.setState({gender:'M'})} inline>Male</Radio>
              {' '}
              <Radio checked={this.state.gender === 'F'} onChange={() => this.setState({gender:'F'})} inline>Female</Radio>

              <br/>
              <ControlLabel>Residence:</ControlLabel>
              <FormControl ref='residence' value={this.state.residence} onChange={this.onChange} type='text'/>

              <ControlLabel>State:</ControlLabel>
              <FormControl ref='state' value={this.state.state} onChange={this.onChange} componentClass='select'>
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
              bsStyle='danger'
              bsSize='large'
            >
              Retire Character
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
  onSave: React.PropTypes.func,
  data: React.PropTypes.object,
}

export default CharacterEditor;
