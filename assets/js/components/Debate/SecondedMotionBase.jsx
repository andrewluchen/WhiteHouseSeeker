import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import moment from 'moment';

import { YEA, NAY, PRES } from './DebateConstants';
import partyColor from '../shared/partyColor';

class SecondedMotionBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      myvote: null,
      yeas: props.motion.yeas,
      nays: props.motion.nays,
      pres: props.motion.pres,
    };
    this.findMyVote = this.findMyVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
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
              yeas: response.yeas,
              nays: response.nays,
              pres: response.pres,
            });
            this.findMyVote(response.yeas, response.nays, response.pres, this.props.active);
          },
        });
      },
    });
  }

  render() {
    let motion = this.props.motion;
    let timeLeft = moment(motion.endtime).fromNow();
    let selectStyle = { active: true }
    let yeas = [];
    this.state.yeas.forEach(vote => {
      yeas.push(
        <span key={vote.id}>
          <Link className={partyColor(vote.party)} to={'/character/' + vote.id}>{vote.name}</Link>,&nbsp;
        </span>
      );
    });
    let nays = [];
    this.state.nays.forEach(vote => {
      nays.push(
        <span key={vote.id}>
          <Link className={partyColor(vote.party)} to={'/character/' + vote.id}>{vote.name}</Link>,&nbsp;
        </span>
      );
    });
    let pres = [];
    this.state.pres.forEach(vote => {
      pres.push(
        <span key={vote.id}>
          <Link className={partyColor(vote.party)} to={'/character/' + vote.id}>{vote.name}</Link>,&nbsp;
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
          <ButtonToolbar>
            <Button onClick={() => this.submitVote(YEA)} {...yeaStyle}>Yea</Button>
            <Button onClick={() => this.submitVote(NAY)} {...nayStyle}>Nay</Button>
            <Button onClick={() => this.submitVote(PRES)} {...presStyle}>Present</Button>
          </ButtonToolbar>
          <div>&nbsp;&nbsp;Vote ends {timeLeft}</div>
        </div>
        <div>
          Proposed by <Link className={partyColor(motion.actor_party)} to={'/character/' + motion.actor_id}>{motion.actor}</Link>
        </div>
        <div>Yea: {yeas}</div>
        <div>Nay: {nays}</div>
        <div>Present: {pres}</div>
      </div>
    );
  }
}

SecondedMotionBase.propTypes = {
  motion: React.PropTypes.object,
  motionName: React.PropTypes.string,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(SecondedMotionBase);
