import React from 'react';
import moment from 'moment';

class TimePermission extends React.Component {
  render() {
    if (this.props.endtime && moment(this.props.endtime).diff(moment()) < 0) {
      return <div>{this.props.substitute}</div>;
    } else {
      return <div>{this.props.children}</div>;
    }
  }
}

TimePermission.propTypes = {
  endtime: React.PropTypes.string,
  substitute: React.PropTypes.string,
}

export default TimePermission;
