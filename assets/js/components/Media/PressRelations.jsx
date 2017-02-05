import React from 'react';
import { Table } from 'react-bootstrap';

class PressRelations extends React.Component {

  render() {
    return (
      <div>
        <div>Press Office</div>
        <Table bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Press Office of</th>
              <th>Number of Press Releases</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </Table>
        <div>Public Appearances</div>
          <Table bordered={true} striped={true}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </Table>
      </div>
    );
  }
}

export default PressRelations;
