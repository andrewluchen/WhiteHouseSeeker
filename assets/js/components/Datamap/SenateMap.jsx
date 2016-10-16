import React from 'react';
import { Link } from 'react-router';
import { Modal } from 'react-bootstrap';

import partyColor from '../shared/partyColor';
import Datamap from './Datamap';

class SenateMap extends React.Component {

  constructor() {
    super();
    this.state = {
      senators: [],
      showModal: false,
      modalContents: null,
    };
    this.fetchSenate = this.fetchSenate.bind(this);
    this.onClickState = this.onClickState.bind(this);
  }

  componentDidMount() {
    this.fetchSenate();
  }

  fetchSenate() {
    $.get(
      'api/capitol/',
      response => {
        this.setState({
          senators: response.senators,
        });
      },
    );
  }

  literalPartyColor(party) {
    if (party[0] === 'D') {
      return 'blue';
    }
    if (party[0] === 'R') {
      return 'red';
    }
    if (party[0] === 'I') {
      return 'green';
    }
  }

  onClickState(st) {
    let stateName = st.stateName;
    let stateSenators = [];
    this.state.senators.forEach(senator => {
      if (senator.state === stateName) {
        stateSenators.push(
          <Link key={senator.id} to={'/character/' + senator.id} className={partyColor(senator.party)}>
            {senator.name}
          </Link>
        )
      }
    });
    let modalContents = (
      <div className='capitol-modal'>
        Senators:<br/>
        {stateSenators}
      </div>
    );
    this.setState({
      modalContents: modalContents,
      showModal: true,
    });
  }

  render() {
    let colors = {};
    this.state.senators.forEach(senator => {
      let state = senator.state;
      if (state in colors) {
        colors[state] = 'purple';
      } else {
        colors[state] = this.literalPartyColor(senator.party);
      }
    });
    let modal = (
      <Modal
        show={this.state.showModal}
        onHide={() => { this.setState({ showModal: false }); }}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        {this.state.modalContents}
      </Modal>
    );
    return (
      <div>
        <Datamap
          startingColors={colors}
          onClickState={this.onClickState}
        />
        {modal}
      </div>
    );
  }
}

export default SenateMap;
