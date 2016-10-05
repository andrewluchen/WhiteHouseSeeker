import React from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux'

import BillEditor from './BillEditor';

class EditBill extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      billId: props.params.billId,
      versionId: props.params.versionId,
      title: '',
      content: '',
    };
    this.fetchBill = this.fetchBill.bind(this);
    this.submitBill = this.submitBill.bind(this);
  }

  componentDidMount() {
    this.fetchBill(this.props.params.billId, this.props.params.versionId);
  }

  fetchBill(billId, versionId) {
    $.get(
      '/api/bill/' + billId + '/' + versionId + '/',
      response => {
        this.setState({
          title: response.title,
          content: response.body,
        });
      },
    );
  }

  submitBill(data) {
    $.ajax({
      url: '/api/bill/' + this.state.billId + '/' + this.state.versionId + '/',
      type: 'POST',
      data: data,
      success: () => {
        browserHistory.push('/bill/' + billId + '/' + versionId);
      }
    });
  }

  render() {
    if (!this.state.title && !this.state.content) {
      return <div/>;
    }
    return (
      <BillEditor
        header='Edit Bill'
        titlePlaceholder='Legislation Name'
        title={this.state.title}
        content={this.state.content}
        onSubmit={this.submitBill}
      />
    );
  }
}

export default EditBill;
