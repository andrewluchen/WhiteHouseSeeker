import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, ControlLabel, DropdownButton, Form, FormControl, MenuItem } from 'react-bootstrap';

import DebateComments from './DebateComments';
import DebateMotions from './DebateMotions';
import Permission from '../Permission/Permission';
import TimePermission from '../Permission/TimePermission';

export const COMMENT = 'comment';
import { UNANIMOUS, AMEND, CLOTURE, REFER, TABLE } from './DebateConstants';

class Debate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      debateId: props.params.debateId,
      billId: 0,
      title: '',
      body: '',
      location: '',
      endtime: null,
      comments: [],
      motions: [],
      motion: COMMENT,
      attachment: null,
    };
    this.fetchDebate = this.fetchDebate.bind(this);
    this.handleMotion = this.handleMotion.bind(this);
    this.submitMotion = this.submitMotion.bind(this);
    this.moveToVote = this.moveToVote.bind(this);
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
          billId: response.bill_id,
          title: response.title,
          body: response.body,
          location: response.location,
          starttime: response.starttime,
          endtime: response.endtime,
          comments: response.comments,
          motions: response.motions,
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
        character_id: this.props.active,
        motion_type: this.state.motion,
        comment: ReactDOM.findDOMNode(this.refs.comment).value,
        attachment: this.state.attachment,
      },
      success: response => {
        this.fetchDebate(this.state.debateId);
      },
    });
  }

  moveToVote(hours) {
    $.ajax({
      url: '/api/debate/officer/' + this.props.params.debateId + '/',
      type: 'POST',
      data: {
        character_id: this.props.active,
        officer: 'move_to_vote',
        hours: hours,
      },
      success: () => {
        browserHistory.push('/' + this.state.location);
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

  render() {
    let placeholder = 'Add comment:\n\nMr./Mme. Speaker,\n  ...\nI yield.';
    return (
      <div>
        <Link to={'/bill/' + this.state.billId}>
          {'< Go to Bill Summary'}
        </Link>
        <div className='debate-officer'>
          Presiding Officer Actions:&nbsp;&nbsp;
          <ButtonToolbar>
            <DropdownButton title='Move To Vote' id='dropdown-basic'>
              <MenuItem eventKey='24' onClick={() => this.moveToVote(24)}>24 hours</MenuItem>
              <MenuItem eventKey='48' onClick={() => this.moveToVote(48)}>48 hours</MenuItem>
              <MenuItem eventKey='72' onClick={() => this.moveToVote(72)}>72 hours</MenuItem>
              <MenuItem eventKey='72' onClick={() => this.moveToVote(96)}>96 hours</MenuItem>
              <MenuItem eventKey='120' onClick={() => this.moveToVote(120)}>120 hours</MenuItem>
            </DropdownButton>
          </ButtonToolbar>
        </div>
        <DebateMotions motions={this.state.motions}/>
        <div className='bill-title'>{this.state.title}</div>
        <div
          className='bill-preview'
          dangerouslySetInnerHTML={{__html: this.state.body}}
        />
        <DebateComments comments={this.state.comments}/>
        <TimePermission
          endtime={this.state.endtime}
          substitute='Time for debate has lapsed.'
        >
          <Permission
            title={this.getPermissionGroup(this.state.location)}
            substitute={'You must be a ' + this.getPermissionGroup(this.state.location) + ' to debate'}
          >
            <Form inline>
              <ControlLabel>Select Action</ControlLabel>&nbsp;
                <FormControl componentClass='select' onChange={this.handleMotion}>
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
        </TimePermission>
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
