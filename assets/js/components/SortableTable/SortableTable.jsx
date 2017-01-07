import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    let sortDir = this.props.sortDir;
    let children = this.props.children;
    return (
      <Cell>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange(e) {
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ? reverseSortDirection(this.props.sortDir) : SortTypes.DESC,
      );
    }
  }
}

const TextCell = args => {
  let rowIndex = args.rowIndex;
  let data = args.data;
  let columnKey = args.data;
  let props = args;
  return (
    <Cell {...props}>
      {data[rowIndex][columnKey]}
    </Cell>
  );
};

class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data[this._indexMap[index]];
  }
}

class SortableTable extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = props.data;

    this._defaultSortIndexes = [];
    for (let index = 0; index < this._dataList.length; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      sortedDataList: new DataListWrapper(this._defaultSortIndexes, this._dataList),
      colSortDirs: {},
    };

    this._onSortChange = this._onSortChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this._dataList = props.data;

    this._defaultSortIndexes = [];
    for (let index = 0; index < this._dataList.length; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.setState({
      sortedDataList: new DataListWrapper(this._defaultSortIndexes, this._dataList),
    })
  }

  _onSortChange(columnKey, sortDir) {
    var sortIndexes = this._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      var valueA = this._dataList[indexA][columnKey];
      var valueB = this._dataList[indexB][columnKey];
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  render() {
    let sortedDataList = this.state.sortedDataList;
    let colSortDirs = this.state.colSortDirs;
    let columns = [];
    this.props.headers.forEach(header => {
      let name = header.name;
      let width = header.width;
      columns.push(
        <Column
          key={name}
          columnKey={name}
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs[name]}
            >
              {name}
            </SortHeaderCell>
          }
          cell={args => {
            let rowIndex = args['rowIndex'];
            return (
              <Cell>
                {this.props.createCellContent(name, sortedDataList.getObjectAt(rowIndex))}
              </Cell>
            );
          }}
          width={width}
          flexGrow={1}
        />
      );
    });
    let width = 0;
    this.props.headers.forEach(header => {
      width += header.width;
    });
    return (
      <Table
        rowHeight={40}
        rowsCount={sortedDataList.getSize()}
        headerHeight={40}
        width={width}
        height={500}
      >
        {columns}
      </Table>
    );
  }
}

SortableTable.propTypes = {
  headers: React.PropTypes.array,
  data: React.PropTypes.array,
  createCellContent: React.PropTypes.func,
<<<<<<< HEAD
=======
};

SortableTable.defaultProps = {
  createCellContent: (header, data) => data[header],
>>>>>>> ce1b5d0aae6cfe9a1fc9f0f2a7364b04773e0d68
};

SortableTable.defaultProps = {
  createCellContent: (header, data) => data[header],
}

export default SortableTable;
