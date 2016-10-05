import React from 'react';
import { connect } from 'react-redux';

import BillEditor from './BillEditor';

class NewBill extends React.Component {

  submitBill(characterID, chamber, data, redirect) {
    data.sponsor_id = characterID;
    data.chamber = chamber;
    $.ajax({
      url: '/api/bill/new/',
      type: 'POST',
      data: data,
      success: () => {
        window.location = redirect;
      },
    });
  }

  render() {
    let chamber = this.props.chamber;
    let characterID = this.props.characterID;
    if (house === 'house') {
      return (
        <BillEditor
          header="House Hopper"
          titlePlaceholder='Legislation Name'
          title=''
          content=''
          onSubmit={data => this.submitBill(characterID, chamber, data, '/house')}
        />
      );
    } else if (house === 'senate') {
      return (
        <BillEditor
          header="Senate Clerk's Office"
          titlePlaceholder='Legislation Name'
          title=''
          content=''
          onSubmit={data => this.submitBill(characterID, chamber, data, '/senate')}
        />
      );
    }
  }
}

NewBill.propTypes = {
  chamber: React.PropTypes.string,
  characterID: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    characterID: state.characters.active,
  }
}

export default connect(mapStateToProps)(NewBill);
