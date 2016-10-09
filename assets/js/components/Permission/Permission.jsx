import React from 'react';
import { connect } from 'react-redux';

class Permission extends React.Component {
  render() {
    let title = '';
    if (this.props.active !== 0) {
      let characters = this.props.characters;
      for (let i = 0; i < characters.length; i++) {
        if (characters[i].id === this.props.active) {
          title = characters[i].title;
          break;
        }
      }
    }
    if (title === this.props.title) {
      return <div>{this.props.children}</div>;
    } else {
      return <div>{this.props.substitute}</div>;
    }
  }
}

Permission.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  partytitle: React.PropTypes.string,
  substitute: React.PropTypes.string,
  user: React.PropTypes.object,
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
}

Permission.defaultProps = {
  title: null,
  subtitle: null,
  partytitle: null,
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    characters: state.characters.characters,
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(Permission);
