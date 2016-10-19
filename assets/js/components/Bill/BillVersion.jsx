import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';

import partyColor from '../shared/partyColor';

class BillVersion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      billId: props.params.billId,
      versionId: props.params.versionId,
      content: '',
      sponsor: null,
      cosponsors: [],
    };
    this.fetchBill = this.fetchBill.bind(this);
  }

  componentDidMount() {
    this.fetchBill(this.props.params.billId, this.props.params.versionId);
  }

  fetchBill(billId, versionId) {
    $.get(
      '/api/bill/' + billId + '/' + versionId + '/',
      response => {
        this.setState({
          content: response.body,
          sponsor: response.sponsor,
          cosponsors: response.cosponsors,
        });
      },
    );
  }

  render() {
    let sponsorLink = null;
    if (this.state.sponsor) {
      sponsorLink = (
        <div>
          <strong>Sponsor:&nbsp;</strong>
          <Link
            to={'/character/' + this.state.sponsor.id}
            className={partyColor(this.state.sponsor.party)}
          >
            {this.state.sponsor.name}
          </Link>
        </div>
      );
    }
    let cosponsorList = [];
    this.state.cosponsors.forEach(cs => {
      cosponsorList.push(
        <span key={cs.id}>
          <Link to={'/character/' + cs.id}  className={partyColor(cs.party)}>
            {cs.name}
          </Link>,&nbsp;
        </span>
      );
    });
    return (
      <div>
        <Link to={'/bill/' + this.props.params.billId}>
          {'< Go to Bill Summary'}
        </Link>
        <br/>
        <br/>
        {sponsorLink}
        <div><strong>Cosponsors List:&nbsp;</strong>{cosponsorList}</div>
        <div>TODO: Cosponsor Button</div>
        <Link to={'/bill/' + this.props.params.billId + '/' + this.props.params.versionId + '/edit'}>
          Edit
        </Link>
        <div
          className='bill-preview'
          dangerouslySetInnerHTML={{__html: this.state.content}}
        />
      </div>
    );
  }
}

BillVersion.propTypes = {
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
};

function mapStateToProps(state) {
  return {
    characters: state.characters.characters,
    active: state.characters.active,
  }
}

export default connect(mapStateToProps)(BillVersion);
