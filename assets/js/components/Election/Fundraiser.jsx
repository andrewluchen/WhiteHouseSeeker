import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { ControlLabel, FormControl, Button } from 'react-bootstrap';
import moment from 'moment';

import Editor from '../Editor/Editor';

class Fundraiser extends React.Component {

  constructor(props) {
    super();
    this.state = {
      editing: false,
      counter: 0,
      timestamp: props.fundraiser.timestamp,
      content: props.fundraiser.body,
      amount: props.fundraiser.amount,
    };
    this.beginEdit = this.beginEdit.bind(this);
    this.fetchFundraiser = this.fetchFundraiser.bind(this);
    this.editFundraiser = this.editFundraiser.bind(this);
    this.gradeFundraiser = this.gradeFundraiser.bind(this);
  }

  beginEdit() {
    this.setState({
      editing: true,
    });
  }

  fetchFundraiser() {
    $.ajax({
      url: '/api/campaign/' + this.props.campaignId + '/',
      type: 'GET',
      success: response => {
        response.fundraisers.some(fundraiser => {
          if (fundraiser.id === this.props.fundraiser.id) {
            this.setState({
              timestamp: fundraiser.timestamp,
              content: fundraiser.body,
              amount: fundraiser.amount,
            });
            return true;
          }
        });
      },
    });
  }

  editFundraiser(content) {
    $.ajax({
      url: '/api/campaign/' + this.props.campaignId + '/',
      type: 'POST',
      data: {
        action: 'edit-fundraiser',
        fundraiser_id: this.props.fundraiser.id,
        character_id: this.props.active,
        content: content,
      },
      success: () => {
        this.fetchFundraiser();
        this.setState({
          counter: this.state.counter + 1,
          editing: false,
        });
      },
    });
  }

  gradeFundraiser() {
    $.ajax({
      url: '/api/campaign/' + this.props.campaignId + '/',
      type: 'POST',
      data: {
        action: 'grade-fundraiser',
        fundraiser_id: this.props.fundraiser.id,
        amount: ReactDOM.findDOMNode(this.refs.amount).value,
      },
      success: () => {
        this.props.refreshWarchest();
      },
    });
  }

  render() {
    if (!this.state.editing) {
      let timestamp = moment(this.state.timestamp);
      let absoluteTime = timestamp.format("ddd, MMM Do 'YY, h:mm a");
      let editLink = null;
      if (this.props.editable) {
        editLink = (
          <a className='fundraiser-edit-link' onClick={this.beginEdit}>Edit</a>
        );
      }
      return (
        <div className='fundraiser'>
          <div className='fundraiser-header'>
            {editLink}
            <div style={{flex:'1'}}/>
            <div>Last Modified {absoluteTime}</div>
          </div>
          <div
            className='preview'
            dangerouslySetInnerHTML={{__html: this.state.content}}
          />
          <div className='fundraiser-grade'>
            <div style={{flex:'2'}}/>
            <ControlLabel>Amount Fundraised:</ControlLabel>
            <FormControl
              ref='amount'
              type='number'
              defaultValue={this.state.amount}
            />
            <Button onClick={this.gradeFundraiser}>Grade</Button>
          </div>
        </div>
      );
    }
    return (
      <div className='fundraiser-edit-container'>
        <Editor
          key={this.state.counter}
          content={this.state.content}
          onCancel={() => {this.setState({editing: false});}}
          onSubmit={this.editFundraiser}
          showPreview={false}/>
      </div>
    );
  }
}

Fundraiser.propTypes = {
  campaignId: React.PropTypes.number,
  fundraiser: React.PropTypes.object,
  editable: React.PropTypes.bool,
  refreshWarchest: React.PropTypes.func,
  active: React.PropTypes.number,
};

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Fundraiser);
