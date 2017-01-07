import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import moment from 'moment';

import { YEA, NAY, PRES } from './DebateConstants';
import Permission from '../Permission/Permission';
import TimePermission from '../Permission/TimePermission';
import createCharacterLink from '../shared/createCharacterLink';

class SecondedMotionBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      motion: null,
      myvote: null,
    };
    this.findMyVote = this.findMyVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.submitSecond = this.submitSecond.bind(this);
  }

  componentDidMount() {
    let motion = this.props.motion;
    let active = this.props.active;
    this.findMyVote(motion.yeas, motion.nays, motion.pres, active);
  }

  componentWillReceiveProps(props) {
    let motion = props.motion;
    let active = props.active;
    this.findMyVote(motion.yeas, motion.nays, motion.pres, active);
  }

  findMyVote(yeas, nays, pres, active) {
    yeas.forEach(yea => {
      if (yea.id === active) {
        this.setState({ myvote: YEA });
      }
    });
    nays.forEach(nay => {
      if (nay.id === active) {
        this.setState({ myvote: NAY });
      }
    });
    pres.forEach(pres => {
      if (pres.id === active) {
        this.setState({ myvote: PRES });
      }
    });
  }

  getPermissionGroup(location) {
    if (location === 'senate') {
      return 'Senator';
    } else if (location === 'house') {
      return 'Representative';
    }
  }

  submitVote(vote) {
    $.ajax({
      url: '/api/debate/motion/' + this.props.motion.id + '/',
      type: 'POST',
      data: {
        character_id: this.props.active,
        action: 'vote',
        vote: vote,
      },
      success: () => {
        $.ajax({
          url: '/api/debate/motion/' + this.props.motion.id + '/',
          type: 'GET',
          success: response => {
            this.setState({
              motion: response,
            });
            this.findMyVote(response.yeas, response.nays, response.pres, this.props.active);
          },
        });
      },
    });
  }

  submitSecond() {
    $.ajax({
      url: '/api/debate/motion/' + this.props.motion.id + '/',
      type: 'POST',
      data: {
        character_id: this.props.active,
        action: 'second',
        hours: 24,
      },
      success: () => {
        $.ajax({
          url: '/api/debate/motion/' + this.props.motion.id + '/',
          type: 'GET',
          success: response => {
            this.setState({
              motion: response,
            });
          },
        });
      },
    });
  }

  render() {
    let motion = this.state.motion ? this.state.motion : this.props.motion;
    if (!motion.seconded) {
      if (this.props.active === motion.actor.id) {
        return (
          <div className='motion'>
            <div className='motion-header'>
              <div className='motion-name'>{this.props.motionName}&nbsp;</div>
            </div>
            <div>
              Proposed by {createCharacterLink(motion.actor.id, motion.actor.party, motion.actor.name)}
            </div>
            {this.props.children}
          </div>
        );
      }
      return (
        <div className='motion'>
          <div className='motion-header'>
            <div className='motion-name'>{this.props.motionName}&nbsp;</div>
            <ButtonToolbar>
              <Button onClick={this.submitSecond}>Second Motion</Button>
            </ButtonToolbar>
          </div>
          <div>
            Proposed by {createCharacterLink(motion.actor.id, motion.actor.party, motion.actor.name)}
          </div>
          {this.props.children}
        </div>
      );
    }
    let timeLeft = moment(motion.endtime).fromNow();
    let selectStyle = { active: true }
    let yeas = [];
    motion.yeas.forEach(vote => {
      yeas.push(
        <span key={vote.id}>
          {createCharacterLink(vote.id, vote.party, vote.name)},&nbsp;
        </span>
      );
    });
    let nays = [];
    motion.nays.forEach(vote => {
      nays.push(
        <span key={vote.id}>
          {createCharacterLink(vote.id, vote.party, vote.name)},&nbsp;
        </span>
      );
    });
    let pres = [];
    motion.pres.forEach(vote => {
      pres.push(
        <span key={vote.id}>
          {createCharacterLink(vote.id, vote.party, vote.name)},&nbsp;
        </span>
      );
    });
    let yeaStyle = this.state.myvote === YEA ? selectStyle : {};
    let nayStyle = this.state.myvote === NAY ? selectStyle : {};
    let presStyle = this.state.myvote === PRES ? selectStyle : {};
    return (
      <div className='motion'>
        <div className='motion-header'>
          <div className='motion-name'>{this.props.motionName}&nbsp;</div>
          <TimePermission
            endtime={motion.endtime}
            substitute='Time for voting for has lapsed.'
          >
            <div className='motion-buttons'>
              <Permission
                title={this.getPermissionGroup(motion.location)}
                substitute={'You must be a ' + this.getPermissionGroup(motion.location) + ' to vote'}
              >
                <ButtonToolbar>
                  <Button onClick={() => this.submitVote(YEA)} {...yeaStyle}>Yea</Button>
                  <Button onClick={() => this.submitVote(NAY)} {...nayStyle}>Nay</Button>
                  <Button onClick={() => this.submitVote(PRES)} {...presStyle}>Present</Button>
                </ButtonToolbar>
              </Permission>
              <div>&nbsp;&nbsp;Vote ends {timeLeft}</div>
            </div>
          </TimePermission>
        </div>
        <div>
          Proposed by&nbsp;
          {createCharacterLink(motion.actor.id, motion.actor.party, motion.actor.name)}
        </div>
        <div>
          Seconded by&nbsp;
          {createCharacterLink(motion.seconded.id, motion.seconded.party, motion.seconded.name)}
        </div>
        <div>Yeas ({yeas.length}): {yeas}</div>
        <div>Nays ({nays.length}): {nays}</div>
        <div>Presents ({pres.length}): {pres}</div>
        {this.props.children}
      </div>
    );
  }
}

SecondedMotionBase.propTypes = {
  motion: React.PropTypes.object,
  motionName: React.PropTypes.string,
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    characters: state.characters.characters,
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(SecondedMotionBase);
