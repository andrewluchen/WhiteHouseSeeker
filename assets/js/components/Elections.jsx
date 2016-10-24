import React from 'react';

class Elections extends React.Component {

  constructor() {
    super();
    this.state = {
      elections: [],
    };
    this.fetchElections = this.fetchElections.bind(this);
  }

  componentDidMount() {
    this.fetchElections();
  }

  fetchElections() {
    $.ajax({
      url: '/api/election/',
      type: 'GET',
      data: {
        active: true
      },
      success: response => {
        this.setState({
          active: characterID,
          data: response,
        });
      },
    });
  }

  render() {
    return (
      <div>
        TODO
      </div>
    );
  }
}

export default Elections;
