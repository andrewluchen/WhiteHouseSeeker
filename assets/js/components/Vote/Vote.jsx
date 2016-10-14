import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Button, ButtonToolbar } from 'react-bootstrap';

import Permission from '../Permission/Permission';
import partyColor from '../shared/partyColor';

const YEA = 'yea';
const NAY = 'nay';
const PRES = 'present';

class Vote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      voteId: props.params.voteId,
      myvote: '',
      yeas: [],
      nays: [],
      pres: [],
      title: '',
      body: '',
      location: '',
      endtime: null,
    };
    this.fetchVote = this.fetchVote.bind(this);
    this.findMyVote = this.findMyVote.bind(this);
    this.castVote = this.castVote.bind(this);
  }

  componentDidMount() {
    this.fetchVote(this.props.params.voteId);
  }

  componentWillReceiveProps(props) {
    this.findMyVote(this.state.yeas, this.state.nays, this.state.pres, props.active);
  }

  fetchVote(voteId) {
    $.ajax({
      url: '/api/vote/' + voteId + '/',
      type: 'GET',
      success: response => {
        this.setState({
          title: response.title,
          body: response.body,
          location: response.location,
          yeas: response.yeas,
          nays: response.nays,
          pres: response.pres,
          starttime: response.starttime,
          endtime: response.endtime,
        });
        this.findMyVote(response.yeas, response.nays, response.pres, this.props.active);
      },
    });
  }

  findMyVote(yeas, nays, pres, active) {
    yeas.forEach(yea => {
      if (yea.id === active) {
        this.setState({ myvote: YEA });
      }
    });
    nays.forEach(nay => {
      if (nay.id === active) {
        this.setState({ myvote: NAY });
      }
    });
    pres.forEach(pres => {
      if (pres.id === active) {
        this.setState({ myvote: PRES });
      }
    });
  }

  castVote(vote) {
    $.ajax({
      url: '/api/vote/' + this.props.params.voteId + '/',
      type: 'POST',
      data: {
        character_id: this.props.active,
        vote: vote,
      },
      success: () => {
        this.setState({
          myvote: vote,
        })
        this.fetchVote(this.props.params.voteId);
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
    let yeas = [];
    let nays = [];
    let pres = [];
    this.state.yeas.forEach(vote => {
      yeas.push(
        <div key={vote.id}>
          <Link className={partyColor(vote.party)} to={'/character/' + vote.id}>
            {vote.name}
          </Link>
        </div>
      );
    })
    this.state.nays.forEach(vote => {
      nays.push(
        <div key={vote.id}>
          <Link className={partyColor(vote.party)} to={'/character/' + vote.id}>
            {vote.name}
          </Link>
        </div>
      );
    })
    this.state.pres.forEach(vote => {
      pres.push(
        <div key={vote.id}>
          <Link className={partyColor(vote.party)} to={'/character/' + vote.id}>
            {vote.name}
          </Link>
        </div>
      );
    })
    let selectStyle = { active: true }
    let yeaStyle = this.state.myvote === YEA ? selectStyle : {};
    let nayStyle = this.state.myvote === NAY ? selectStyle : {};
    let presStyle = this.state.myvote === PRES ? selectStyle : {};
    return (
      <div>
        <Permission
          title={this.getPermissionGroup(this.state.location)}
          substitute={'You must be a ' + this.getPermissionGroup(this.state.location) + ' to vote'}
        >
          <div className='vote-buttons'>
            <Button
              bsSize='large'
              onClick={() => this.castVote(YEA)}
              {...yeaStyle}
            >
              Yea
            </Button>
            <Button
              bsSize='large'
              onClick={() => this.castVote(NAY)}
              {...nayStyle}
            >
              Nay
            </Button>
            <Button
              bsSize='large'
              onClick={() => this.castVote(PRES)}
              {...presStyle}
            >
              Present
            </Button>
          </div>
        </Permission>
        <Grid>
          <Row className='show-grid'>
            <Col sm={8} md={4}>
              <strong>Yeas:</strong>
              {yeas}
            </Col>
            <Col sm={8} md={4}>
              <strong>Nays:</strong>
              {nays}
            </Col>
            <Col sm={8} md={4}>
              <strong>Present:</strong>
              {pres}
            </Col>
          </Row>
        </Grid>

        <div className='bill-title'>{this.state.title}</div>
        <div
          className='bill-preview'
          dangerouslySetInnerHTML={{__html: this.state.body}}
        />
      </div>
    );
  }
}

Vote.propTypes = {
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Vote);
