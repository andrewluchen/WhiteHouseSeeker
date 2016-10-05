import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';

class ClerkOffice extends React.Component {

  render() {
    let bills = []
    this.props.bills.forEach(bill => {
      bills.push(
        <tr key={bill.bill_id}>
          <td>
            <Link to={'/bill/' + bill.bill_id + '/' + bill.version_id}>
              {bill.title}
            </Link>
          </td>
          <td>{bill.sponsor}</td>
        </tr>
      );
    });
    return (
      <div className='chamber-room'>
        <div className='chamber-header'>{this.props.name}</div>
        <Link to={this.props.newRoute}>New Legislation</Link>
        <Table striped={true}>
          <thead>
            <tr>
              <th>Bill Title</th>
              <th>Sponsor</th>
            </tr>
          </thead>
          <tbody>
            {bills}
          </tbody>
        </Table>
      </div>
    );
  }
}

ClerkOffice.propTypes = {
  name: React.PropTypes.string,
  newRoute: React.PropTypes.string,
  bills: React.PropTypes.array,
}

export default ClerkOffice;
