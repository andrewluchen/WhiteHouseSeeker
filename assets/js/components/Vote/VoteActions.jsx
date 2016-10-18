import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';

class VoteActions extends React.Component {

  render() {
    let sendToHouse = (
      <MenuItem onClick={this.props.onSendToHouse}>Send to the House</MenuItem>
    );
    let sendToSenate = (
      <MenuItem onClick={this.props.onSendToSnate}>Send to the Senate</MenuItem>
    );
    let sendToPotus = (
      <MenuItem onClick={this.props.onSendToPotus}>Send to the President's Desk</MenuItem>
    );
    let overrideVeto = (
      <MenuItem onClick={this.props.onOverrideVeto}>Override Veto</MenuItem>
    );
    let passLaw = (
      <MenuItem onClick={this.props.onPassLaw}>Pass into Law</MenuItem>
    );
    let failedLegislation = (
      <MenuItem onClick={this.props.onFailedLegislation}>Failed Legislation</MenuItem>
    );
    if (
      (this.props.location === 'senate' && this.props.pastLocations.includes('house')) ||
      (this.props.location === 'house' && this.props.pastLocations.includes('senate'))
    ) {
      if (this.props.pastLocations.includes('potusdesk')) {
        return (
          <ButtonToolbar>
            <DropdownButton title='Count Vote'>
              {overrideVeto}
              {failedLegislation}
            </DropdownButton>
          </ButtonToolbar>
        );
      } else {
        return (
          <ButtonToolbar>
            <DropdownButton title='Count Vote'>
              {sendToPotus}
              {failedLegislation}
              <MenuItem divider />
              {passLaw}
            </DropdownButton>
          </ButtonToolbar>
        );
      }
    } else if (this.props.location === 'senate') {
      return (
        <ButtonToolbar>
          <DropdownButton title='Count Vote'>
            {sendToHouse}
            {failedLegislation}
            <MenuItem divider />
            {sendToPotus}
            {passLaw}
          </DropdownButton>
        </ButtonToolbar>
      );
    } else if (this.props.location === 'house') {
      return (
        <ButtonToolbar>
          <DropdownButton title='Count Vote'>
            {sendToSenate}
            {failedLegislation}
            <MenuItem divider />
            {sendToPotus}
            {passLaw}
          </DropdownButton>
        </ButtonToolbar>
      );
    }
    return (
      <ButtonToolbar>
        <DropdownButton title='Count Vote'>
        </DropdownButton>
      </ButtonToolbar>
    );
  }
}

VoteActions.propTypes = {
  location: React.PropTypes.string,
  pastLocations: React.PropTypes.array,
  onSendToHouse: React.PropTypes.func,
  onSendToSenate: React.PropTypes.func,
  onSendToPotus: React.PropTypes.func,
  onOverrideVeto: React.PropTypes.func,
  onPassLaw: React.PropTypes.func,
  onFailedLegislation: React.PropTypes.func,
}

export default VoteActions;
