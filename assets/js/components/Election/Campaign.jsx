import React from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import Editor from '../Editor/Editor';
import NewFundraiser from './NewFundraiser';
import createCharacterLink from '../shared/createCharacterLink'

class Campaign extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      campaignId: props.params.campaignId,
      title: '',
      withdrawn: false,
      character: {},
      election: {},
      warchest: {},
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
          title: response.description,
          character: response.candidate.character,
          election: response.election,
          warchest: response.warchest,
          withdrawn: response.withdrawn,
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
    let fundraisers = [];
    return (
      <div>
        <div className='campaign-header' style={withdrawStyle}>
          {this.state.title} {withdraw}
        </div>
        <div className='campaign-subheader'>{subheader}</div>
        <br/>
        <br/>
        <div className='campaign-warchest'>{warchest}</div>
        <div className='campagin-fundraisers'>{fundraisers}</div>
        <NewFundraiser campaignId={this.state.campaignId}/>
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
