import React from 'react';

class Tweet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ups: props.tweet.ups,
      downs: props.tweet.downs,
    };
  }

  render() {
    let tweetContent = this.props.tweet;
    let content = [];
    let re = /#[A-Za-z0-9-_]+/g;
    let m = re.exec(tweetContent);
    let i = 0;
    while (m) {
      content.push(
        <span key={i}>{tweetContent.slice(i, m.index)}</span>
      );
      content.push(
        <span key={i+1} className='hashtag'>
          {tweetContent.slice(m.index, m.index + m[0].length)}
        </span>
      );
      i = m.index + m[0].length;
      m = re.exec(tweetContent);
    }
    content.push(
      <span key={i}>{tweetContent.slice(i)}</span>
    );
    let handle = '@' + this.props.handle;
    let username = this.props.username;
    return (
      <div className='tweet'>
        <div className='tweet-vote'>
          <div className='tweet-up' onClick={() => this.props.callback('+')}/>
          <div className='tweet-number'>{this.props.score}</div>
          <div className='tweet-down' onClick={() => this.props.callback('-')}/>
        </div>
        <div className='tweet-content'>
          <div className='tweet-title'>
            {content}
          </div>
          <div className='tweet-author'>
            {handle} [{username}]
          </div>
        </div>
      </div>
    );
  }
}

Tweet.propTypes = {
  callback: React.PropTypes.func,
  score: React.PropTypes.number,
  tweet: React.PropTypes.string,
  handle: React.PropTypes.string,
  username: React.PropTypes.string,
};

export default Tweet;
