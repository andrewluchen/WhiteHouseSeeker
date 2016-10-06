import React from 'react';

class Bill extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      billId: props.params.billId,
      sponsor: '',
      cosponsors: [],
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
          sponsor: response.sponsor,
          cosponsors: response.cosponsors,
        })
      },
    );
  }

  render() {
    let sponsorLink = null;
    if (this.state.sponsor) {
      sponsorLink = (
        <div>
          <strong>Sponsor:&nbsp;</strong>
          <Link to={'/character/' + this.state.sponsor.id}>
            {this.state.sponsor.name}
          </Link>
        </div>
      );
    }
    let cosponsorList = [];
    this.state.cosponsors.forEach(cs => {
      cosponsorList.push(
        <Link key={cs.id} to={'/character/' + cs.id}>{cs.name}</Link>
      );
    });
    return (
      <div>
        {sponsorLink}
        <div>Latest Action:</div>
        <div>Tracker:</div>
        <div>___</div>
        <div>There are versions: [dropdown]</div>
        <div>Cosponsors:</div>
        {cosponsorList}
      </div>
    );
  }
}

export default Bill;
