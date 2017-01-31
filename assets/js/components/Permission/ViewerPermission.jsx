import React from 'react';
import { connect } from 'react-redux';

class ViewerPermission extends React.Component {
  render() {
    let character = { titles: [] };
    if (this.props.active !== 0) {
      let characters = this.props.characters;
      for (let i = 0; i < characters.length; i++) {
        if (characters[i].id === this.props.active) {
          character = characters[i];
          break;
        }
      }
    }
    if (character.titles.indexOf(this.props.title) !== -1) {
      return <div>{this.props.children}</div>;
    } else {
      return <div>{this.props.substitute}</div>;
    }
  }
}

ViewerPermission.propTypes = {
  title: React.PropTypes.string,
  substitute: React.PropTypes.string,
  user: React.PropTypes.object,
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    characters: state.characters.characters,
    active: state.characters.active,
  };
}

export default connect(mapStateToProps)(ViewerPermission);
