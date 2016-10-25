import React from 'react';

import { Table } from 'react-bootstrap';

class Warchest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      warchestId: props.params.warchestId,
      current: 0,
      transactions: [],
    };
    this.fetchWarchest = this.fetchWarchest.bind(this);
  }

  componentDidMount() {
    this.fetchWarchest(this.props.params.warchestId);
  }

  fetchWarchest(warchestId) {
    $.ajax({
      url: '/api/warchest/' + warchestId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          current: response.current,
          transactions: response.transactions,
        })
      },
    });
  }

  render() {
    let transactions = [];
    this.state.transactions.forEach(transaction => {
      let colorStyle = transaction.sign === '-' ? {color:'red'} : {}
      transactions.push(
        <tr key={transaction.id}>
          <td>{transaction.description ? transaction.description : 'unprocessed...'}</td>
          <td style={colorStyle}>
            {transaction.sign + '$' + transaction.amount.toLocaleString()}
          </td>
        </tr>
      );
    });
    return (
      <div>
        <div className='warchest-total'>
          Warchest: ${this.state.current.toLocaleString()}
        </div>
        <Table className='usgs-table' bordered={true} striped={true}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Warchest;
