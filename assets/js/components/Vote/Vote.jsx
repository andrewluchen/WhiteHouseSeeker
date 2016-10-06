import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import moment from 'moment';

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
      endtime: moment(),
    };
    this.fetchVote = this.fetchVote.bind(this);
  }

  componentDidMount() {
    this.fetchVote(this.props.params.voteId);
  }

  componentWillReceiveProps(props) {
    this.findMyVote(this.state.yeas, this.state.nays, this.state.pres, props.active);
  }

  fetchVote(voteId) {
    $.get(
      '/api/vote/' + voteId + '/',
      response => {
        this.setState({
          title: response.title,
          body: response.body,
          yeas: response.yeas,
          nays: response.nays,
          pres: response.pres,
          starttime: response.starttime,
          endtime: response.endtime,
        });
        this.findMyVote(response.yeas, response.nays, response.pres, this.props.active);
      },
    );
  }

  findMyVote(yeas, nays, pres, active) {
    yeas.forEach(yea => {
      if (yea.id === active) {
        this.setState({ myvote: 'yea' });
      }
    });
    nays.forEach(nay => {
      if (nay.id === active) {
        this.setState({ myvote: 'nay' });
      }
    });
    pres.forEach(pres => {
      if (pres.id === active) {
        this.setState({ myvote: 'present' });
      }
    });
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
    let yeas = [];
    let nays = [];
    let pres = [];
    this.state.yeas.forEach(vote => {
      yeas.push(
        <div key={vote.id}>
          <Link className={this.partyColor(vote.party)} to={'/character/' + vote.id}>
            {vote.name}
          </Link>
        </div>
      );
    })
    this.state.nays.forEach(vote => {
      nays.push(
        <div key={vote.id}>
          <Link className={this.partyColor(vote.party)} to={'/character/' + vote.id}>
            {vote.name}
          </Link>
        </div>
      );
    })
    this.state.pres.forEach(vote => {
      pres.push(
        <div key={vote.id}>
          <Link className={this.partyColor(vote.party)} to={'/character/' + vote.id}>
            {vote.name}
          </Link>
        </div>
      );
    })
    return (
      <div>
        {this.state.myvote}
        TODO: VOTE RADIO HERE
        <Grid>
          <Row className="show-grid">
            <Col sm={6} md={3}>
              <strong>Yeas:</strong>
              {yeas}
            </Col>
            <Col sm={6} md={3}>
              <strong>Nays:</strong>
              {nays}
            </Col>
            <Col sm={6} md={3}>
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
  }
}

export default connect(mapStateToProps)(Vote);
