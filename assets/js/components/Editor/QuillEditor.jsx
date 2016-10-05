import React from 'react';
import { Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';

class QuillEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: props.content
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(content, delta, source, editor) {
    this.setState({
      content: content,
    })
  }

  onSubmit() {
    this.props.onSubmit(this.state.content);
  }

  render() {
    return (
      <div className='editor_container'>
        <div className='editor'>
          <ReactQuill
            theme='snow'
            value={this.state.content}
            onChange={this.onChange}
          />
        </div>
        <Button
          bsStyle='primary'
          bsSize='large'
          onClick={this.onSubmit}
        >
          Submit
        </Button>
        <div
          className='preview'
          dangerouslySetInnerHTML={{__html: this.state.content}}
        />
      </div>
    );
  }
}

QuillEditor.propTypes = {
  content: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
}

export default QuillEditor;
