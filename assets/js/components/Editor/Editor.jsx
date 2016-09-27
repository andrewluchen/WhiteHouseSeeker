import React from 'react';
import ReactQuill from 'react-quill';

class Editor extends React.Component {
  render() {
    return (
      <div className='editor'>
        <ReactQuill theme='snow'/>
      </div>
    );
  }
}

export default Editor;
