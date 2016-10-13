import React from 'react';

export const COMMENT = 'comment';
export const UNANIMOUS = 'unanimous';
export const AMEND = 'amend';
export const CLOTURE = 'cloture';
export const REFER = 'refer';
export const TABLE = 'table';

class DebateComments extends React.Component {

  render() {
    let comments = [];
    this.props.motions.forEach(motion => {
      <div>
      </div>
    });
    return (
      <div>{comments}</div>
    );
  }
}

DebateComments.propTypes = {
  motions: React.PropTypes.array,
};

export default DebateComments;
