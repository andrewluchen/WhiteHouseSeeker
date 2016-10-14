import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import SecondedMotionBase from './SecondedMotionBase';

class MotionTable extends React.Component {

  render() {
    return (
      <SecondedMotionBase motionName='Motion for Lay on the Table'/>
    );
  }
}

MotionTable.propTypes = {
  motion: React.PropTypes.object,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.auth.active,
  };
}

export default connect(mapStateToProps)(MotionTable);
