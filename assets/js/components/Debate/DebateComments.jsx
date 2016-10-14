import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import partyColor from '../shared/partyColor';

class DebateComments extends React.Component {

  render() {
    let comments = [];
    this.props.comments.forEach(comment => {
      let timestamp = moment(comment.timestamp);
      let absoluteTime = timestamp.format("ddd, MMM Do 'YY, h:mm a");
      let relativeTime = timestamp.fromNow();
      comments.push(
        <div key={comment.id} className='comment'>
          <div className='comment-header'>
            <Link
              className={'comment-character' + ' ' + partyColor(comment.party)}
              to={'/character/' + comment.character_id}
            >
              {comment.character_name}
            </Link>
            <div className='comment-timestamp'>{absoluteTime} ({relativeTime})</div>
          </div>
          <div className='comment-content'>
            {comment.comment}
          </div>
        </div>
      );
    });
    return (
      <div>{comments}</div>
    );
  }
}

DebateComments.propTypes = {
  comments: React.PropTypes.array,
};

export default DebateComments;
