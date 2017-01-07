import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import SecondedMotionBase from './SecondedMotionBase';

class MotionCloture extends React.Component {

  render() {
    return (
      <SecondedMotionBase
        motionName='Motion for Cloture'
        motion={this.props.motion}
      />
    );
  }
}

MotionCloture.propTypes = {
  motion: React.PropTypes.object,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.auth.active,
  };
}

export default connect(mapStateToProps)(MotionCloture);
