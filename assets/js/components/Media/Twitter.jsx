import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ControlLabel, FormControl, Pagination } from 'react-bootstrap';

import Tweet from './Tweet';

class Twitter extends React.Component {

  constructor() {
    super();
    this.state = {
      page: 1,
      tweet: '',
      tweets: [],
    };
    this.fetchTwitter = this.fetchTwitter.bind(this);
    this.onTweetChange = this.onTweetChange.bind(this);
    this.submitTweet = this.submitTweet.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.tweetVote = this.tweetVote.bind(this);
  }

  componentDidMount() {
    this.fetchTwitter();
  }

  fetchTwitter() {
    $.ajax({
      url: '/api/tweets/',
      type: 'GET',
      data: {
      },
      success: response => {
        this.setState({
          tweets: response,
        });
      },
    });
  }

  onTweetChange() {
    this.setState({
      tweet: ReactDOM.findDOMNode(this.refs.tweet).value.slice(0, 140),
    });
  }

  submitTweet() {
    let tweet = ReactDOM.findDOMNode(this.refs.tweet).value.slice(0, 140);
    let hashtags = [];
    let re = /#[A-Za-z0-9-_]+/g;
    let m = re.exec(tweet);
    while (m) {
      hashtags.push(m[0]);
      m = re.exec(tweet);
    }
    hashtags = hashtags.join();
    $.ajax({
      url: '/api/tweet/new/',
      type: 'POST',
      data: {
        handle: ReactDOM.findDOMNode(this.refs.handle).value,
        tweet: tweet,
        hashtags: hashtags,
      },
      success: () => {
        this.fetchTwitter();
        this.setState({
          tweet: '',
        });
      },
    });
  }

  selectPage(eventKey) {
    this.setState({
      page: eventKey,
    })
  }

  tweetVote(id, vote) {
    $.ajax({
      url: '/api/tweet/' + id + '/',
      type: 'POST',
      data: {
        vote: vote,
      },
      success: response => {
        this.fetchTwitter();
      },
    });
  }

  render() {
    let tweets = [];
    let hashtags = {};
    this.state.tweets.sort((x, y) => Math.abs(y.relevance) - Math.abs(x.relevance));
    this.state.tweets.forEach(tweet => {
      let tags = tweet.hashtags.split(',');
      tags.forEach(tag => {
        if (tag in hashtags) {
          hashtags[tag] += Math.abs(tweet.score);
        } else {
          hashtags[tag] = Math.abs(tweet.score);
        }
      });
      tweets.push(
        <Tweet
          key={tweet.id}
          callback={vote => this.tweetVote(tweet.id, vote)}
          score={tweet.score}
          tweet={tweet.tweet}
          handle={tweet.handle}
          username={tweet.author}
        />
      );
    });
    let keys = [];
    for (let key in hashtags) {
      keys.push(key);
    }
    keys.sort((x, y) => hashtags[y] - hashtags[x]);
    keys = keys.slice(0, 10);
    let trending = keys.map(key => <span key={key}>{key}&nbsp;&nbsp;</span>);
    return (
      <div>
        <div className='twitter-controls'>
          <div className='twitter-handle'>
            <ControlLabel>@&nbsp;</ControlLabel>
            <FormControl ref='handle' type='text' placeholder='Twitter Username'/>
          </div>
          <div style={{flex:'2'}}/>
          <div className='twitter-count'>{140 - this.state.tweet.length} characters left</div>
        </div>
        <FormControl
          ref='tweet'
          componentClass='textarea'
          className='twitter-textarea'
          value={this.state.tweet}
          onChange={this.onTweetChange}
        />
        <div className={'twitter-buttons'}>
          <div style={{flex:'1'}}/>
          <Button bsStyle='info' onClick={this.submitTweet}>Tweet!</Button>
        </div>
        <br/>
        <div className='twitter-hottest'>Top Shared Tweets</div>
        <div className='twitter-trending'>
          Trending:&nbsp;&nbsp;
          <span>{trending}</span>
        </div>
        <div className='twitter-pagination-container'>
          <div style={{flex:'1'}}/>
          <Pagination items={1} activePage={this.state.page} onSelect={this.selectPage}/>
        </div>
        {tweets}
      </div>
    );
  }
}

export default Twitter;
