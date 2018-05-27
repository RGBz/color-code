import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PatternPropType } from './prop-types';
import CellView from './CellView';

export default class PatternEditor extends Component {

  onCellClick (x, y) {
    const { penValue, pattern, onUpdate } = this.props;
    const updatedPattern = pattern.clone();
    updatedPattern.grid.set(x, y, penValue);
    onUpdate(updatedPattern);
  }

  renderRow (y) {
    const cells = [];
    for (let x = 0; x < this.props.pattern.grid.width; x += 1) {
      cells.push(this.renderCell(x, y))
    }
    return (<div key={y} className="row">{cells}</div>);
  }

  renderCell (x, y) {
    const centerX = Math.floor(this.props.pattern.grid.width / 2);
    const centerY = Math.floor(this.props.pattern.grid.height / 2);
    const cellValue = this.props.pattern.grid.get(x, y);
    const isCenter = x === centerX && y === centerY;
    const cellStyle = {};
    if (isCenter) {
      cellStyle.border = '2px solid rgba(0,0,0,0.5)';
      cellStyle.margin = 0;
      cellStyle.width = 14;
      cellStyle.height = 14;
    }
    return (
      <CellView
        key={x}
        penValue={cellValue}
        palette={this.props.palette}
        style={cellStyle}
        onClick={() => this.onCellClick(x, y)}
      />
    );
  }

  render () {
    const rows = [];
    for (let y = 0; y < this.props.pattern.grid.height; y += 1) {
      rows.push(this.renderRow(y));
    }
    return (<div className="pattern">{rows}</div>);
  }

}

PatternEditor.propTypes = {
  penValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  pattern: PatternPropType.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
