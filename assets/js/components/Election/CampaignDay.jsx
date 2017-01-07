import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import Editor from '../Editor/Editor';

class CampaignDay extends React.Component {

  constructor(props) {
    super();
    this.state = {
      campaignId: props.params.campaignId,
      campaignDayId: props.params.campaignDayId,
      electionId: 0,
      characterId: 0,
      editable: false,
      content: '',
      costs: 0,
      timestamp: '',
      editing: false,
      counter: 0,
    };
    this.fetchCampaignDay = this.fetchCampaignDay.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.editDay = this.editDay.bind(this);
  }

  componentDidMount() {
    this.fetchCampaignDay(this.props.active, this.props.params.campaignDayId);
  }

  componentWillReceiveProps(props) {
    this.fetchCampaignDay(props.active, this.props.params.campaignDayId);
  }

  fetchCampaignDay(active, campaignDayId) {
    if (active === 0) {
      return;
    }
    $.ajax({
      url: '/api/campaign_day/' + campaignDayId + '/',
      type: 'GET',
      data: {
        character_id: active,
      },
      success: response => {
        this.setState({
          electionId: response.election_id,
          character: response.character,
          content: response.body,
          costs: response.costs,
          timestamp: response.timestamp,
          editable: response.editable,
        });
      },
    });
  }

  beginEdit() {
    this.setState({
      editing: true,
    });
  }

  editDay(content) {
    $.ajax({
      url: '/api/campaign_day/' + this.props.params.campaignDayId + '/',
      type: 'POST',
      data: {
        character_id: this.props.active,
        content: content,
      },
      success: () => {
        this.fetchCampaignDay(this.props.params.campaignDayId);
        this.setState({
          editing: false,
          counter: this.state.counter + 1,
        });
      },
    });
  }

  render() {
    if (!this.state.character) {
      return (
        <div className='campaignday'>
          <div className='campaignday-links'>
            <Link to={'/campaign/' + this.props.params.campaignDayId}>
              {'< Go to Campaign'}
            </Link>
            <div style={{flex:'1'}}/>
            <Link to={'/election/' + this.state.electionId}>
              {'Go to Election >'}
            </Link>
          </div>
        </div>
      );
    }
    if (this.state.editing && this.state.editable) {
      return (
        <div className='campaignday'>
          <div className='campaignday-links'>
            <Link to={'/campaign/' + this.props.params.campaignDayId}>
              {'< Go to Campaign'}
            </Link>
            <div style={{flex:'1'}}/>
            <Link to={'/election/' + this.state.electionId}>
              {'Go to Election >'}
            </Link>
          </div>
          <br/>
          <Editor
            key={this.state.counter}
            content={this.state.content}
            onCancel={() => {this.setState({editing: false});}}
            onSubmit={this.editDay}
            showPreview={false}
          />
        </div>
      );
    }
    let timestamp = moment(this.state.timestamp);
    let absoluteTime = timestamp.format("ddd, MMM Do 'YY, h:mm a");
    let editLink = null;
    if (this.state.editable) {
      editLink = (
        <a className='fundraiser-edit-link' onClick={this.beginEdit}>Edit</a>
      );
    }
    return (
      <div className='campaignday'>
        <div className='campaignday-links'>
          <Link to={'/campaign/' + this.props.params.campaignDayId}>
            {'< Go to Campaign'}
          </Link>
          <div style={{flex:'1'}}/>
          <Link to={'/election/' + this.state.electionId}>
            {'Go to Election >'}
          </Link>
        </div>
        <div className='campaignday-container'>
          <div className='campaignday-header'>
            {editLink}
            <div style={{flex:'1'}}/>
            <div>Last Modified {absoluteTime}</div>
          </div>
          <div
            className='preview'
            dangerouslySetInnerHTML={{__html: this.state.content}}
          />
        </div>
      </div>
    );
  }
}

CampaignDay.propTypes = {
  active: React.PropTypes.number,
};

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(CampaignDay);
