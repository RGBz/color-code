import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PatternPropType } from '../prop-types';
import CellView from './CellView';

export default class PatternEditor extends Component {

  onCellClick (x, y) {
    const { penValue, pattern, onUpdate } = this.props;
    const updatedPattern = pattern.clone();
    updatedPattern.grid.set(x, y, penValue);
    onUpdate(updatedPattern);
  }

  render () {
    const { penValue, palette, pattern: { grid, grid: { rows } } } = this.props;
    const centerX = Math.floor(grid.width / 2);
    const centerY = Math.floor(grid.height / 2);
    return (
      <div className="pattern">
        {rows.map((cells, y) =>
          <div key={y} className="row">
            {cells.map((cellValue, x) => {
              const isCenter = x === centerX && y === centerY;
              return (
                <CellView
                  key={x}
                  penValue={cellValue}
                  palette={palette}
                  style={{ border: isCenter ? '1px solid black' : undefined }}
                  onClick={() => this.onCellClick(x, y)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

}

PatternEditor.propTypes = {
  penValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  pattern: PatternPropType.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
