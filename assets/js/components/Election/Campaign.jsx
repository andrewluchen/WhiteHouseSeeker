import React from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import Editor from '../Editor/Editor';
import Fundraiser from './Fundraiser';
import NewFundraiser from './NewFundraiser';
import Platform from './Platform';
import createCharacterLink from '../shared/createCharacterLink'

class Campaign extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      campaignId: props.params.campaignId,
      election: {},
      title: '',
      withdrawn: false,
      character: {},
      warchest: {},
      days: [],
      platform: '',
      fundraisers: [],
    };
    this.fetchCampaign = this.fetchCampaign.bind(this);
    this.withdrawCampaign = this.withdrawCampaign.bind(this);
  }

  componentDidMount() {
    this.fetchCampaign(this.props.params.campaignId);
  }

  fetchCampaign(campaignId) {
    $.ajax({
      url: '/api/campaign/' + campaignId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          election: response.election,
          title: response.description,
          withdrawn: response.withdrawn,
          character: response.candidate.character,
          warchest: response.warchest,
          days: response.days,
          platform: response.platform,
          fundraisers: response.fundraisers,
        });
      },
    });
  }

  fetchWarchest(warchestId) {
    $.ajax({
      url: '/api/warchest/' + warchestId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          warchest: response,
        });
      },
    });
  }

  withdrawCampaign() {
    $.ajax({
      url: '/api/campaign/' + this.props.params.campaignId + '/',
      type: 'POST',
      data: {
        action: 'withdraw',
        character_id: this.props.active,
      },
      success: () => {
        browserHistory.push('/elections');
      },
    });
  }

  render() {
    let withdraw = null;
    let withdrawStyle = this.state.withdrawn ? {textDecoration: 'line-through'} : {};
    if (
      !this.state.withdrawn &&
      this.props.active === this.state.character.id
    ) {
      withdraw = (
        <Button bsSize="xsmall" bsStyle='danger' onClick={this.withdrawCampaign}>
          Withdraw
        </Button>
      );
    }
    let subheader = null;
    if (this.state.character.id) {
      subheader = createCharacterLink(
        this.state.character.id,
        this.state.character.party,
        this.state.character.name,
      );
    }
    let warchest = null;
    if (this.state.warchest.id) {
      warchest = (
        <span>
          Warchest:&nbsp;
          <Link to={'/warchest/' + this.state.warchest.id}>
            ${parseInt(this.state.warchest.current).toLocaleString()}
          </Link>
        </span>
      );
    }
    let campaignDays = [];
    this.state.days.forEach(day => {
      if (day.editable) {
        campaignDays.push(
          <Link
            key={day.id}
            className='campaign-day-link'
            to={'/campaign/' + this.state.campaignId + '/' + day.id}
          >
            Day {day.day}
          </Link>
        );
      } else {
        campaignDays.push(
          <Link
            key={day.id}
            className='campaign-day-link'
            to={'/election/' + this.state.election.id}
          >
            Day {day.day} (*ENDED*)
          </Link>
        );
      }
    });
    let fundraisers = [];
    this.state.fundraisers.forEach(fundraiser => {
      fundraisers.push(
        <Fundraiser
          key={fundraiser.id}
          campaignId={parseInt(this.props.params.campaignId)}
          fundraiser={fundraiser}
          editable={this.state.can_edit}
          refreshWarchest={() => this.fetchWarchest(this.state.warchest.id)}
        />
      );
    });
    return (
      <div>
        <Link to={'/election/' + this.state.election.id}>
          {'< Go to Election'}
        </Link>
        <div className='campaign-header' style={withdrawStyle}>
          {this.state.title} {withdraw}
        </div>
        <div className='campaign-subheader'>{subheader}</div>
        <div className='campaign-warchest'>{warchest}</div>
        <br/>
        <div className='campaign-days'>Campaign Days:</div>
        {campaignDays}
        <br/><br/>
        <div className='campaign-subheader'>Platform</div>
        <Platform
          campaignId={parseInt(this.props.params.campaignId)}
          platform={this.state.platform}
          editable={this.state.can_edit}
        />
        <br/>
        <div className='campaign-subheader'>Fundraisers</div>
        <div className='fundraisers'>{fundraisers}</div>
        {
          this.state.can_edit ?
          <NewFundraiser
            campaignId={parseInt(this.props.params.campaignId)}
            onNewFundraiser={() => this.fetchCampaign(this.props.params.campaignId)}
          /> :
          null
        }
      </div>
    );
  }
}

Campaign.propTypes = {
  user: React.PropTypes.object,
  active: React.PropTypes.number,
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Campaign);
