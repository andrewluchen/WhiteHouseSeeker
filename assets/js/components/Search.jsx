import React from 'react';

import SortableTable from './SortableTable/SortableTable';

class Search extends React.Component {

  constructor() {
    super();
    this.state = {
      characters: [],
    };
    this.renderCharacters = this.renderCharacters.bind(this);
  }

  componentDidMount() {
    $.get(
      'api/characters/',
      response => {
        this.setState({
          characters: response,
        });
      },
    );
  }

  renderCharacters() {
    let headers = [
      { name: 'state', width: 70 },
      { name: 'party', width: 200 },
      { name: 'name', width: 350 },
    ];
    let data = this.state.characters;
    return (
      <SortableTable
        headers={headers}
        data={data}
      />
    );
  }

  render() {
    return (
      <div className='search'>
        {this.renderCharacters()}
      </div>
    );
  }
}

export default Search;
