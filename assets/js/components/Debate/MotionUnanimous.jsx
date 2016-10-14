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
    this.state = {
      nays: [],
    }
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
      success: () => {
        $.ajax({
          url: '/api/debate/motion/' + this.props.motion.id + '/',
          type: 'GET',
          success: response => {
            this.setState({
              nays: response.nays,
            });
          },
        });
      }
    });
  }

  render() {
    let motion = this.props.motion;
    let timeLeft = moment(motion.endtime).fromNow();
    let objected = null;
    let nays = this.state.nays.length > 0 ? this.state.nays : motion.nays;
    if (nays.length > 0) {
      let party = nays[0].party;
      let id = nays[0].id;
      let actor = nays[0].name
      objected = (
        <div>
          Objected by <Link className={partyColor(party)} to={'/character/' + id}>{actor}</Link>
        </div>
      );
    }
    return (
      <div className='motion'>
        <div className='motion-header'>
          <div className='motion-name'>Motion for Unanimous Consent&nbsp;</div>
          <ButtonToolbar>
            <Button onClick={this.submitObject} disabled={objected !== null}>Object</Button>
          </ButtonToolbar>
          <div>&nbsp;&nbsp;Ends {timeLeft}</div>
        </div>
        <div>
          Proposed by <Link className={partyColor(motion.actor_party)} to={'/character/' + motion.actor_id}>{motion.actor}</Link>
          {objected}
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
