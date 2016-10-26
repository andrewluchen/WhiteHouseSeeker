import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import TinyMCE from 'react-tinymce';

class TinymceEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: props.content
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
        <div style={{display:'flex'}}>
          <ButtonToolbar>
            <div style={{flex:'1'}}/>
            {this.props.onCancel ? <Button bsStyle='warning' bsSize='large' onClick={this.props.onCancel}>Cancel</Button> : null}
            <Button
              bsStyle='primary'
              bsSize='large'
              onClick={this.onSubmit}
            >
              Submit
            </Button>
          </ButtonToolbar>
        </div>
        <div
          className='preview'
          dangerouslySetInnerHTML={{__html: this.state.content}}
        />
      </div>
    );
  }
}

TinymceEditor.propTypes = {
  content: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  showPreview: React.PropTypes.bool,
};

QuillEditor.defaultProps = {
  onCancel: null,
  showPreview: true,
};

export default TinymceEditor;
