import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';

class VotingRecord extends React.Component {

  render() {
    let yeas = [];
    let nays = [];
    let pres = [];
    let sponsored = [];
    let cosponsored = [];
    this.props.yeas.forEach(vote => {
      yeas.push(
        <div key={vote.vote_id}>
          <Link to={'/vote/' + vote.vote_id}>
            {vote.title}
          </Link>
        </div>
      );
    });
    this.props.nays.forEach(vote => {
      nays.push(
        <div key={vote.vote_id}>
          <Link to={'/vote/' + vote.vote_id}>
            {vote.title}
          </Link>
        </div>
      );
    });
    this.props.pres.forEach(vote => {
      pres.push(
        <div key={vote.vote_id}>
          <Link to={'/vote/' + vote.vote_id}>
            {vote.title}
          </Link>
        </div>
      );
    });
    this.props.sponsored.forEach(bill => {
      sponsored.push(
        <div key={bill.bill_id}>
          <Link to={'/bill/' + bill.bill_id}>
            {bill.title}
          </Link>
        </div>
      );
    });
    this.props.cosponsored.forEach(bill => {
      cosponsored.push(
        <div key={bill.bill_id}>
          <Link to={'/bill/' + bill.bill_id}>
            {bill.title}
          </Link>
        </div>
      );
    });
    return (
      <div>
        <Grid>
          <Row className='show-grid'>
            <Col sm={8} md={4}>
              <strong>Sponsored:</strong>
              {sponsored}
            </Col>
            <Col sm={8} md={4}>
              <strong>Cosponsored:</strong>
              {cosponsored}
            </Col>
          </Row>
        </Grid>
        <br/>
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
      </div>
    );
  }
}

VotingRecord.propTypes = {
  yeas: React.PropTypes.array,
  nays: React.PropTypes.array,
  pres: React.PropTypes.array,
}

export default VotingRecord;
