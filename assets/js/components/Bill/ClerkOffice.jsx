import React from 'react';
import { Link } from 'react-router';

class ClerkOffice extends React.Component {

  render() {
    return (
      <div>
        <Link to={this.props.newRoute}>New Legislation</Link>
      </div>
    );
  }
}

ClerkOffice.propTypes = {
  newRoute: React.PropTypes.string,
}

export default ClerkOffice;
