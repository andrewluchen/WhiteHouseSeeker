import React from 'react';
import { FormControl } from 'react-bootstrap';

class CharacterSelector extends React.Component {

  constructor() {
    super();
    this.state = {
      active: 0,
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps (props) {
    this.setState({
      active: props.active,
    })
  }

  onChange(e) {
    let value = parseInt(e.target.value);
    this.setState({
      active: value,
    })
    this.props.onSelect(value);
  }

  render() {
    let characters = <option value=''>You have no characters...</option>;
    if (this.props.characters.length !== 0 || this.props.newOption) {
      characters = [];
      this.props.characters.forEach(character => {
        let description = character.description;
        characters.push(
          <option value={character.pk} key={character.pk}>{character.description}</option>
        );
      })
      if (this.props.newOption) {
        characters.push(
          <option value={0} key={0}>Create New Character</option>
        );
      }
    }
    return (
      <div>
        <FormControl componentClass='select' value={this.props.active} onChange={this.onChange}>
          {characters}
        </FormControl>
      </div>
    );
  }
}

CharacterSelector.propTypes = {
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
  onSelect: React.PropTypes.func,
  newOption: React.PropTypes.bool,
}

export default CharacterSelector;
