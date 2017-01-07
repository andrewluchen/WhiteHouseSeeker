import React from 'react';
import ReactDOM from 'react-dom';
import { ControlLabel, FormControl } from 'react-bootstrap';

import { FROM_STATES } from '../../StateConstants';

class SenateSeatsPicker extends React.Component {

  constructor() {
    super();
    this.state = {
      seats: [],
      selected: {
        party: '',
      },
    };
    this.selectSeat = this.selectSeat.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    $.get(
      'api/capitol/',
      response => {
        this.setState({
          seats: response.senate_seats,
        });
        this.selectSeat(response.senate_seats[0]);
      },
    );
  }

  selectSeat(seat) {
    this.setState({
      selected: seat,
    });
    this.props.onSelect(seat.id, seat.state, seat.party);
  }

  onChange(e) {
    this.selectSeat(this.state.seats[e.target.value]);
  }

  render() {
    let seats = [];
    this.state.seats.forEach(seat => {
      if (!seat.holder) {
        seats.push(
          <option key={seat.id} value={seat.id} className={seat.party}>
            {FROM_STATES[seat.state]} -- Class {seat.class} ({seat.party})
          </option>
        );
      }
    });
    let cn = this.state.selected.party.toLowerCase().split(' ')[0];
    return (
      <div>
        <ControlLabel>Senate Seat:</ControlLabel>
        <FormControl ref='seat' className={cn} onChange={this.onChange} componentClass='select'>
          {seats}
        </FormControl>
      </div>
    );
  }
}

SenateSeatsPicker.propTypes = {
  show: React.PropTypes.bool,
  onHide: React.PropTypes.func,
  onSelect: React.PropTypes.func,
};

export default SenateSeatsPicker;
