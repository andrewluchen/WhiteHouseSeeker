import React from 'react';
import { connect } from 'react-redux';

import Editor from '../Editor/Editor';

class Platform extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      counter: 0,
      content: props.platform,
    };
    this.fetchPlatform = this.fetchPlatform.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.editPlatform = this.editPlatform.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      content: props.platform,
    });
  }

  fetchPlatform() {
    $.ajax({
      url: '/api/campaign/' + this.props.campaignId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          content: response.platform,
        });
      },
    });
  }

  beginEdit() {
    this.setState({
      editing: true,
    });
  }

  editPlatform(content) {
    $.ajax({
      url: '/api/campaign/' + this.props.campaignId + '/',
      type: 'POST',
      data: {
        action: 'edit-platform',
        character_id: this.props.active,
        platform: content,
      },
      success: () => {
        this.fetchPlatform();
        this.setState({
          counter: this.state.counter + 1,
          editing: false,
        });
      },
    });
  }

  render() {
    if (this.props.editable && this.state.editing) {
      return (
        <div className='platform-edit-container'>
          <Editor
            key={this.state.counter}
            content={this.state.content}
            onCancel={() => {this.setState({editing: false});}}
            onSubmit={this.editPlatform}
            showPreview={false}/>
        </div>
      );
    }

    return (
      <div className='platform'>
        {
          this.props.editable ?
          <div className='platform-header'>
            <a className='platform-edit-link' onClick={this.beginEdit}>Edit</a>
          </div> :
          null
        }
        <div
          className='preview'
          dangerouslySetInnerHTML={{__html: this.state.content}}
        />
      </div>
    );
  }
}

Platform.propTypes = {
  campaignId: React.PropTypes.number,
  platform: React.PropTypes.string,
  editable: React.PropTypes.bool,
  active: React.PropTypes.number,
};

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Platform);
