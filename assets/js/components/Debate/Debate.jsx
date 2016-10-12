import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Button, ControlLabel, Form, FormControl } from 'react-bootstrap';

import Permission from '../Permission/Permission';

const COMMENT = 'comment';
const UNANIMOUS = 'unanimous';
const AMEND = 'amend';
const CLOTURE = 'cloture';
const REFER = 'refer';
const TABLE = 'table';

class Debate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      debateId: props.params.debateId,
      title: '',
      body: '',
      location: '',
      endtime: null,
      motion: COMMENT,
      attachment: null,
    };
    this.fetchDebate = this.fetchDebate.bind(this);
    this.handleMotion = this.handleMotion.bind(this);
    this.submitMotion = this.submitMotion.bind(this);
  }

  componentDidMount() {
    this.fetchDebate(this.props.params.debateId);
  }

  fetchDebate(debateId) {
    $.ajax({
      url: '/api/debate/' + debateId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          title: response.title,
          body: response.body,
          location: response.location,
          starttime: response.starttime,
          endtime: response.endtime,
        });
      },
    });
  }

  handleMotion(e) {
    this.setState({
      motion: e.target.value,
    });
  }

  submitMotion() {
    $.ajax({
      url: '/api/debate/' + this.props.params.debateId + '/',
      type: 'POST',
      data: {
        motion_type: this.state.motion,
        comment: ReactDOM.findDOMNode(this.refs.comment).value,
        attachment: this.state.attachment,
      },
      success: response => {
        this.fetchDebate(this.state.debateId);
      },
    });
  }

  getPermissionGroup(location) {
    if (location === 'senate') {
      return 'Senator';
    } else if (location === 'house') {
      return 'Representative';
    }
  }

  partyColor(party) {
    if (party[0] === 'D') {
      return 'democratic';
    }
    if (party[0] === 'R') {
      return 'republican';
    }
    if (party[0] === 'I') {
      return 'independent';
    }
  }

  render() {
    let placeholder = 'Add comment:\n\nMr./Mme. Speaker,\n  ...\nI yield.';
    return (
      <div>
        <div className='bill-title'>{this.state.title}</div>
        <div
          className='bill-preview'
          dangerouslySetInnerHTML={{__html: this.state.body}}
        />
        <Permission
          title={this.getPermissionGroup(this.state.location)}
          substitute={'You must be a ' + this.getPermissionGroup(this.state.location) + ' to vote'}
        >
          <Form inline>
            <ControlLabel>Select Action</ControlLabel>&nbsp;
              <FormControl componentClass='select' onChange={this.handleAction}>
                <option value={COMMENT}>Add Comment</option>
                <option value={UNANIMOUS}>Motion for Unanimous Consent</option>
                <option value={AMEND}>Motion to Amend</option>
                <option value={CLOTURE}>Move for Cloture</option>
                <option value={REFER}>Refer to Committee</option>
                <option value={TABLE}>Lay on the Table</option>
              </FormControl>
          </Form>
          <FormControl
            ref='comment'
            componentClass='textarea'
            className='debate-comment'
            placeholder={placeholder}
          />
          <Button
            bsStyle='primary'
            className='debate-submit'
            onClick={this.submitMotion}
          >
            Submit
          </Button>
        </Permission>
      </div>
    );
  }
}

Debate.propTypes = {
  active: React.PropTypes.number,
};

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Debate);
