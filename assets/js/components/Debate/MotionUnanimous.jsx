import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import moment from 'moment';

import { YEA, NAY, PRES } from './DebateConstants';
import partyColor from '../shared/partyColor';

class MotionUnanimous extends React.Component {

  constructor(props) {
    super(props);
    this.submitObject = this.submitObject.bind(this);
  }

  submitObject() {
    $.ajax({
      url: '/api/debate/motion/' + this.props.motion.id + '/',
      type: 'POST',
      data: {
        character_id: this.props.active,
        action: 'object',
      },
    });
  }

  render() {
    let motion = this.props.motion;
    let timeLeft = moment(motion.endtime).fromNow();
    return (
      <div className='motion'>
        <div className='motion-header'>
          <div className='motion-name'>Motion for Unanimous Consent&nbsp;</div>
          <ButtonToolbar>
            <Button onClick={this.submitObject}>Object</Button>
          </ButtonToolbar>
          <div>&nbsp;&nbsp;Ends {timeLeft}</div>
        </div>
        <div>
          Proposed by <Link className={partyColor(motion.actor_party)} to={'/character/' + motion.actor_id}>{motion.actor}</Link>
        </div>
      </div>
    );
  }
}

MotionUnanimous.propTypes = {
  motion: React.PropTypes.object,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(MotionUnanimous);
