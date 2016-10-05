import React from 'react';

class Bill extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      billId: props.params.billId,
    };
    this.fetchBill = this.fetchBill.bind(this);
  }

  componentDidMount() {
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
        <div>Sponsor:</div>
        <div>Latest Action:</div>
        <div>Tracker:</div>
        <div>___</div>
        <div>There are versions: [dropdown]</div>
        <div>Cosponsors</div>
      </div>
    );
  }
}

export default Bill;
