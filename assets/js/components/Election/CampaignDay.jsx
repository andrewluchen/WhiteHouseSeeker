import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Editor from '../Editor/Editor';

class CampaignDay extends React.Component {

  constructor(props) {
    super();
    this.state = {
      campaignId: props.params.campaignId,
      campaignDayId: props.params.campaignDayId,
    };
    this.fetchCampaignDay = this.fetchCampaignDay.bind(this);
  }

  componentDidMount() {
    this.fetchCampaignDay(this.props.params.campaignDayId);
  }

  fetchCampaignDay(campaignDayId) {
    $.ajax({
      url: '/api/campaign_day/' + campaignDayId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          electionId: response.election_id,
          editable: response.editable,
          timestamp: response.timestamp,
          content: response.body,
          costs: response.costs,
        });
      },
    });
  }

  render() {
    return (
      <div>
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
        <Editor/>
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
