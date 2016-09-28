import React from 'react';
import ReactQuill from 'react-quill';

class Editor extends React.Component {

  constructor() {
    super();
    this.state = {
      content: ""
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
          <ReactQuill theme='snow' onChange={this.onChange}/>
        </div>
        <button onClick={this.onSubmit}>Submit</button>
        <div
          className='preview'
          dangerouslySetInnerHTML={{__html: this.state.content}}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  onSubmit: React.PropTypes.func,
}

export default Editor;
