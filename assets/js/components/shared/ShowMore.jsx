import React from 'react';

class ShowMore extends React.Component {

  constructor() {
    super();
    this.state = {
      show: false,
    };
  }

  render() {
    if (this.state.show) {
      return (
        <div>
          <a onClick={this.setState({show: false})}>Hide &lt;&lt;</a>
          {this.props.children}
        </div>
      );
    } else {
      return <a onClick={this.setState({show: true})}>Show More &gt;&gt;</a>;
    }
  }
}

ShowMore.propTypes = {
  showText: React.PropTypes.string,
  hideText: React.PropTypes.string,
}

export default ShowMore;
