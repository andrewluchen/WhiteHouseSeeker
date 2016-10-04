import React from 'react';
import { Button } from 'react-bootstrap';
import TinyMCE from 'react-tinymce';

class TinymceEditor extends React.Component {

  constructor() {
    super();
    this.state = {
      content: ""
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      content: e.target.getContent(),
    });
  }

  onSubmit() {
    this.props.onSubmit(this.state.content);
  }

  render() {
    return (
      <div className='editor_container'>
        <div className='editor'>
          <TinyMCE
            content={this.state.content}
            config={{
              plugins: ' image code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
            }}
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

TinymceEditor.propTypes = {
  onSubmit: React.PropTypes.func,
}

export default TinymceEditor;
