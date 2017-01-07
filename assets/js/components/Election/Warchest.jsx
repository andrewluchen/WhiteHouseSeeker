import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';

class Warchest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      warchestId: props.params.warchestId,
      character: {},
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
          character: response.character,
          current: response.current,
          transactions: response.transactions,
        })
      },
    });
  }

  render() {
    let transactions = [];
    this.state.transactions.forEach(transaction => {
      let colorStyle = transaction.sign === '-' ? { color:'red' } : {}
      transactions.push(
        <tr key={transaction.id}>
          <td>{transaction.description}</td>
          <td className='warchest-number' style={colorStyle}>
            {transaction.sign + '$' + transaction.amount.toLocaleString()}
          </td>
        </tr>
      );
    });
    return (
      <div>
        <div className='warchest-total'>
          <Link to={'/character/' + this.state.character.id}>
            {this.state.character.name}
          </Link>
          &nbsp;
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
