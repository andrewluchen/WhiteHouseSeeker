import React from 'react';

import Editor from '../Editor/Editor';

class BillEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      content: props.content,
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
    let data = {
      title: title,
      body: body,
    };
    this.props.onSubmit(data);
  }

  render() {
    return (
      <div>
        <div className='bill-header'>{this.props.header}</div>
        <input
          className='bill-title'
          placeholder={this.props.titlePlaceholder}
          value={this.state.title}
          onChange={this.onChange}
        />
        <Editor
          content={this.state.content}
          onSubmit={content => this.onSubmit(this.state.title, content)}
        />
      </div>
    );
  }
}

BillEditor.propTypes = {
  header: React.PropTypes.string,
  titlePlaceholder: React.PropTypes.string,
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
}

export default BillEditor;
