import React from 'react';
import { connect } from 'react-redux';

class Wtf extends React.Component {

  render() {
    return (
      <div>
        <div>Welcome to WTF!</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active: state.auth.active,
  };
}

export default connect(mapStateToProps)(Wtf);
