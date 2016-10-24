import React from 'react';
import { connect } from 'react-redux';

import Editor from '../Editor/Editor';

class NewFundraiser extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(fundraiser) {
    console.log(fundraiser);
    $.ajax({
      url: '/api/campaign/',
      type: 'POST',
      data: {
        action: 'new-fundraiser',
        character_id: this.props.active,
        fundraiser: fundraiser,
      },
      success: () => {
      },
    });
  }

  render() {
    return (
      <div>
        <div className='fundraiser-new'>Start New Fundraiser</div>
        <Editor onSubmit={this.onSubmit} showPreview={false}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(NewFundraiser);
