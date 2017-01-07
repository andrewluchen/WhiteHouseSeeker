import React from 'react';
import { connect } from 'react-redux';

class LoggedInPermission extends React.Component {
  render() {
    if (!this.props.user) {
      return <div>{this.props.substitute}</div>;
    } else {
      return <div>{this.props.children}</div>;
    }
  }
}

LoggedInPermission.propTypes = {
  user: React.PropTypes.object,
  substitute: React.PropTypes.string,
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(LoggedInPermission);
