import React from 'react';

import Editor from '../Editor/Editor';

class BillEditor extends React.Component {

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
    $.ajax({
      url: this.props.endpoint,
      type: this.props.verb,
      data: {
        title: title,
        body: body,
      },
      success: function(data) {
        window.location = redirect;
      }
    });
  }

  render() {
    return (
      <div>
        <div className='bill-header'>{this.props.header}</div>
        <input
          className='bill-title'
          placeholder={this.props.titlePlaceholder}
          onChange={this.onChange}
        />
        <Editor onSubmit={content => this.onSubmit(this.state.title, content)}/>
      </div>
    );
  }
}

BillEditor.propTypes = {
  header: React.PropTypes.string,
  titlePlaceholder: React.PropTypes.string,
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  endpoint: React.PropTypes.string,
  verb: React.PropTypes.string,
  redirect: React.PropTypes.string,
}

export default BillEditor;
