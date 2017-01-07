import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import moment from 'moment';

import { YEA, NAY, PRES } from './DebateConstants';
import createCharacterLink from '../shared/createCharacterLink';

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
    let objectButton = null;
    let nays = this.state.nays.length > 0 ? this.state.nays : motion.nays;
    if (nays.length === 0) {
      if (this.props.active === motion.actor.id) {
        objectButton = <span>Ends {timeLeft}</span>;
      } else {
        objectButton = (
          <div className='motion-buttons'>
            <ButtonToolbar>
              <Button onClick={this.submitObject} disabled={objected !== null}>Object</Button>
            </ButtonToolbar>
            <div>&nbsp;&nbsp;Ends {timeLeft}</div>
          </div>
        );
      }
    } else {
      let party = nays[0].party;
      let id = nays[0].id;
      let actor = nays[0].name
      objected = (
        <div>
          Objected by {createCharacterLink(id, party, actor)}
        </div>
      );
    }
    return (
      <div className='motion'>
        <div className='motion-header'>
          <div className='motion-name'>Motion for Unanimous Consent&nbsp;</div>
          {objectButton}
        </div>
        <div>
          Proposed by {createCharacterLink(motion.actor.id, motion.actor.party, motion.actor.name)}
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
