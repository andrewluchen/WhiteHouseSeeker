import React from 'react';

class BillVersion extends React.Component {

  constructor() {
    super();
    this.state = {
      versionId: 0,
    };
    this.fetchBill = this.fetchBill.bind(this);
  }

  componentDidMount() {
    this.setState({
      billId: this.props.params.billId,
      versionId: this.props.params.versionId,
    });
    this.fetchBill(this.props.params.billId, this.props.params.versionId);
  }

  fetchBill(billId, versionId) {
  }

  render() {
    return (
      <div>
        asdfff
      </div>
    );
  }
}

export default BillVersion;
