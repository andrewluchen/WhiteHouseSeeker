import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Editor from '../Editor/Editor';

class NewFundraiser extends React.Component {

  constructor() {
    super();
    this.state = {
      counter: 0,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(fundraiser) {
    $.ajax({
      url: '/api/campaign/' + this.props.campaignId + '/',
      type: 'POST',
      data: {
        action: 'new-fundraiser',
        character_id: this.props.active,
        title: ReactDOM.findDOMNode(this.refs.title).value,
        fundraiser: fundraiser,
      },
      success: () => {
        this.props.onNewFundraiser();
        this.setState({
          counter: this.state.counter + 1,
        });
      },
    });
  }

  render() {
    return (
      <div>
        <div className='fundraiser-new-title'>
          <input ref='title' placeholder='New Fundraiser'/>
        </div>
        <Editor
          key={this.state.counter}
          onSubmit={this.onSubmit}
          showPreview={false}
        />
      </div>
    );
  }
}

NewFundraiser.propTypes = {
  campaignId: React.PropTypes.number,
  active: React.PropTypes.number,
  onNewFundraiser: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(NewFundraiser);
