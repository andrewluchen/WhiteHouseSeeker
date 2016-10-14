import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';

import Permission from '../Permission/Permission';

class ClerkOffice extends React.Component {

  momentSort(left, right) {
    left = left.endtime;
    right = right.endtime;
    return moment(left).diff(moment(right))
  }

  render() {
    let bills = []
    this.props.bills.forEach(bill => {
      bills.push(
        <tr key={bill.billId}>
          <td>
            <Link to={'/bill/' + bill.billId + '/' + bill.versionId}>
              {bill.title}
            </Link>
          </td>
          <td>{bill.sponsor}</td>
        </tr>
      );
    });
    return (
      <div className='chamber-clerk'>
        <div className='chamber-header'>{this.props.name}</div>
        <div className='chamber-cornerlink'>
          <Permission
            title={this.props.permissionGroup}
            substitute={'You must be a ' + this.props.permissionGroup + ' to submit bills'}
          >
            <Link to={this.props.newRoute}>+ New Legislation</Link>
          </Permission>
        </div>
        <Table bordered={true} striped={true}>
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
  permissionGroup: React.PropTypes.string,
  newRoute: React.PropTypes.string,
  bills: React.PropTypes.array,
}

export default ClerkOffice;
