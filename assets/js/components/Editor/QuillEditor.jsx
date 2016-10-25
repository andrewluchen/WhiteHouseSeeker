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
        <div style={{display:'flex'}}>
          <div style={{flex:'1'}}/>
          {this.props.onCancel ? <Button bsStyle='warning' bsSize='large' onClick={this.props.onCancel}>Cancel</Button> : null}
          <Button
            bsStyle='primary'
            bsSize='large'
            onClick={this.onSubmit}
          >
            Submit
          </Button>
        </div>
        <div
          hidden={!this.props.showPreview}
          className='preview'
          dangerouslySetInnerHTML={{__html: this.state.content}}
        />
      </div>
    );
  }
}

QuillEditor.propTypes = {
  content: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  showPreview: React.PropTypes.bool,
};

QuillEditor.defaultProps = {
  onCancel: null,
  showPreview: true,
};

export default QuillEditor;
