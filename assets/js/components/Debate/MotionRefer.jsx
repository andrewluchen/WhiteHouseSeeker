import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import SecondedMotionBase from './SecondedMotionBase';

class MotionRefer extends React.Component {

  render() {
    return (
      <SecondedMotionBase
        motionName='Motion to Refer to Committee'
        motion={this.props.motion}
      />
    );
  }
}

MotionRefer.propTypes = {
  motion: React.PropTypes.object,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.auth.active,
  };
}

export default connect(mapStateToProps)(MotionRefer);
