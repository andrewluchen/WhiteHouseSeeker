import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';
import {Tabs, Tab} from 'material-ui/Tabs';

import BillTrackerStepper from './BillTrackerStepper';
import partyColor from '../shared/partyColor';

class Bill extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      billId: props.params.billId,
      billTitle: '',
      sponsor: '',
      cosponsors: [],
      versions: [],
    };
    this.fetchBill = this.fetchBill.bind(this);
  }

  componentDidMount() {
    this.fetchBill(this.props.params.billId);
  }

  fetchBill(billId) {
    $.get(
      '/api/bill/' + billId + '/',
      response => {
        this.setState({
          billTitle: response.title,
          sponsor: response.sponsor,
          cosponsors: response.cosponsors,
          versions: response.versions,
        })
      },
    );
  }

  render() {
    let sponsorLink = null;
    if (this.state.sponsor) {
      sponsorLink = (
        <Row className='show-grid'>
          <Col xs={3} md={2}>
            <strong>Sponsor:</strong>
          </Col>
          <Col xs={6} md={4}>
            <Link
              to={'/character/' + this.state.sponsor.id}
              className={partyColor(this.state.sponsor.party)}
            >
              {this.state.sponsor.name}
            </Link>
          </Col>
        </Row>
      );
    }
    let cosponsorList = [];
    this.state.cosponsors.forEach(cs => {
      cosponsorList.push(
        <div>
          <Link
            key={cs.id}
            to={'/character/' + cs.id}
            className={'bill-cosponsor' + ' ' + partyColor(this.state.sponsor.party)}
          >
            {cs.name}
          </Link>
        </div>
      );
    });
    let latestAction = null;
    return (
      <Grid>
        <Row className = 'bill-overview'>
          <div className='bill-overview-header'>{this.state.billTitle}</div>
          <div className='bill-overview-label'>BILL</div>
          <div className='bill-overview-panel'>
            {sponsorLink}
            {latestAction}
            <div><strong>Tracker:</strong></div>
            <BillTrackerStepper versions={this.state.versions}/>
          </div>
        </Row>
        <Row>
          <Tabs>
            <Tab label={'Versions (' + this.state.versions.length + ')'} >
              TODO:
            </Tab>
            <Tab label={'Actions (' + this.state.versions.length + ')'} >
              TODO:
            </Tab>
            <Tab label={'Cosponsors (' + this.state.cosponsors.length + ')'} >
              {cosponsorList}
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    );
  }
}

export default Bill;
