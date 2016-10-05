import React from 'react';

class Bill extends React.Component {

  constructor() {
    super();
    this.state = {
      billId: 0,
    };
    this.fetchBill = this.fetchBill.bind(this);
  }

  componentDidMount() {
    this.setState({
      billId: this.props.params.billId,
    });
    this.fetchBill(this.props.params.billId);
  }

  fetchBill(billId) {
    $.get(
      '/api/bill/' + billId + '/',
      data => {
      },
    );
  }

  render() {
    return (
      <div>
        asdf
      </div>
    );
  }
}

export default Bill;
