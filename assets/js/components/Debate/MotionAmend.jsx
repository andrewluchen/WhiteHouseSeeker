import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

class MotionAmend extends React.Component {

  render() {
    return (
      <SecondedMotionBase motionName='Motion to Amend'/>
    );
  }
}

MotionAmend.propTypes = {
  motion: React.PropTypes.object,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.auth.active,
  };
}

export default connect(mapStateToProps)(MotionAmend);
