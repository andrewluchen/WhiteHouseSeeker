import React from 'react';

import Editor from '../Editor/Editor';

class NewBill extends React.Component {

  constructor() {
    super();
    this.state = {
      title: '',
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({
      title: event.target.value,
    })
  }

  onSubmit(title, body) {
    let redirect = this.props.redirect
    $.post(
      this.props.endpoint,
      {
        title: title,
        body: body,
      },
      function(data) {
        window.location = this.props.redirect;
      }
    )
  }

  render() {
    return (
      <div>
        <div className='bill-header'>{this.props.header}</div>
        <input
          className='bill-title'
          placeholder='Legislation Title'
          onChange={this.onChange}
        />
        <Editor onSubmit={content => this.onSubmit(this.state.title, content)}/>
      </div>
    );
  }
}

NewBill.propTypes = {
  header: React.PropTypes.string,
  endpoint: React.PropTypes.string,
  redirect: React.PropTypes.string,
}

export default NewBill;
