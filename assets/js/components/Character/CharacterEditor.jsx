import React from 'react';
import ReactDOM from 'react-dom';
import { Col, Grid, Row } from 'react-bootstrap';
import { Button, ControlLabel, FormControl, Radio } from 'react-bootstrap';

import { STATES, FROM_STATES } from '../../StateConstants';
import SenateSeatsPicker from './SenateSeatsPicker';

class CharacterEditor extends React.Component {

  constructor(props) {
    super(props);
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
      party: this.rand < 0.25 || this.rand > 0.75 ? 'Republican' : 'Democratic',
      avatar: '',
      bio: '',
      titles: [],
      senateSeatId: null,
      showSenate: false,
    }
    if (props.partyOption) {
      this.state.party = props.partyOption;
    }
    this.saveCharacter = this.saveCharacter.bind(this);
    this.retireCharacter = this.retireCharacter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.chooseSenate = this.chooseSenate.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.data.name) {
      let data = props.data;
      this.setState({
        name: data.name,
        birthday: data.birthday,
        gender: data.gender,
        residence: data.residence,
        state: data.state,
        party: data.party,
        avatar: data.avatar,
        bio: data.bio,
        titles: data.titles,
      });
    } else {
      this.setState({
        name: '',
        birthday: '',
        gender: this.rand > 0.5 ? 'M' : 'F',
        residence: '',
        state: this.randState,
        party: this.rand < 0.25 || this.rand > 0.75 ? 'Republican' : 'Democratic',
        avatar: '',
        bio: '',
        titles: [],
      });
      if (props.partyOption) {
        this.setState({
          party: props.partyOption,
        });
      }
    }
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
      senator: this.state.senateSeatId,
   });
  }

  retireCharacter() {
    this.props.onRetire();
  }

  onChange(event) {
    this.setState({
      name: ReactDOM.findDOMNode(this.refs.name).value,
      birthday: ReactDOM.findDOMNode(this.refs.birthday).value,
      residence: ReactDOM.findDOMNode(this.refs.residence).value,
      avatar: ReactDOM.findDOMNode(this.refs.avatar).value,
      bio: ReactDOM.findDOMNode(this.refs.bio).value,
    });
    if (!this.state.showSenate) {
      this.setState({
        state: ReactDOM.findDOMNode(this.refs.state).value,
        party: ReactDOM.findDOMNode(this.refs.party).value,
      })
    }
  }

  chooseSenate(senatSeatId, state, party) {
    this.setState({
      state: state,
      party: party,
      senateSeatId: senatSeatId,
    });
  }

  render() {
    let makeSenator = <div>Only one Senator per account</div>;
    if (this.props.senatorOption) {
      makeSenator = (
        <div>
          {
            this.state.showSenate
            ?
            <SenateSeatsPicker
              onSelect={this.chooseSenate}
            />
            :
            <Button onClick={() => {this.setState({showSenate: true});}}>
              Make me a Senator
            </Button>
          }
        </div>
      );
    }
    if (this.state.titles.includes('Senator')) {
      makeSenator = (
        <div>You are <strong>{this.state.party} Senator</strong> from <strong>{FROM_STATES[this.state.state]}</strong></div>
      );
    }
    let stateOptions = []
    for (let key in STATES){
      stateOptions.push(
        <option value={STATES[key]} key={key}>{key + ' (' + STATES[key] + ')'}</option>
      );
    }
    let states = (
      <FormControl ref='state' value={this.state.state} onChange={this.onChange} componentClass='select'>
        {stateOptions}
      </FormControl>
    );
    let cn = this.state.party.toLowerCase().split(' ')[0];
    let parties = (
      <FormControl ref='party' className={cn} componentClass='select' value={this.state.party} onChange={this.onChange}>
        <option className='democratic' value='Democratic'>Democratic</option>
        <option className='republican' value='Republican'>Republican</option>
        <option className='independent' value='Independent Democrat'>Independent (Caucus with Democrats)</option>
        <option className='independent' value='Independent Republican'>Independent (Caucus with Republicans)</option>
        <option className='fourthestate' value='Media'>The Fourth Estate (don't pick me)</option>
      </FormControl>
    );
    if (this.props.partyOption) {
      let party = null;
      if (this.props.partyOption === 'Democratic') {
        party = [
          <option key={'d'} className='democratic' value='Democratic'>Democratic</option>,
          <option key={'id'} className='independent' value='Independent Democrat'>Independent (Caucus with Democrats)</option>,
        ];
      }
      if (this.props.partyOption === 'Republican') {
        party = [
          <option key={'r'} className='republican' value='Republican'>Republican</option>,
          <option key={'ir'} className='independent' value='Independent Republican'>Independent (Caucus with Republicans)</option>,
        ];
      }
      parties = (
        <FormControl ref='party' className={cn} componentClass='select' value={this.state.party} onChange={this.onChange}>
          {party}
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

              <br/>
              {makeSenator}

              {
                !this.state.showSenate && !this.state.titles.includes('Senator')
                ?
                <div>
                  <ControlLabel>State:</ControlLabel>
                  {states}
                  <ControlLabel>Party (all your characters must be from the same party):</ControlLabel>
                  {parties}
                </div>
                :
                null
              }
            </Col>
          </Row>

          <ControlLabel>Biography:</ControlLabel>
          <FormControl ref='bio' value={this.state.bio} onChange={this.onChange} componentClass='textarea'/>

          <div className='character-buttons'>
            {
              this.props.data.id
              ?
              <Button
                bsStyle='danger'
                bsSize='large'
                onClick={this.retireCharacter}
              >
                Retire Character
              </Button>
              :
              null
            }
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
  data: React.PropTypes.object,
  partyOption: React.PropTypes.string,
  senatorOption: React.PropTypes.bool,
  onSave: React.PropTypes.func,
}

export default CharacterEditor;
