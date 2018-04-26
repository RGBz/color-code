import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PaletteView extends Component {

  render () {
    const { selectedPenValue, onSelectPen, palette } = this.props;
    return (
      <div className="palette">
        {palette.map((color, penValue) => {
          const swatchStyle = { backgroundColor: color };
          if (penValue === selectedPenValue) {
            swatchStyle.border = '1px solid black';
          }
          return (
            <div
              key={penValue}
              className="swatch"
              style={swatchStyle}
              onClick={() => onSelectPen(penValue)}
            />
          );
        })}
      </div>
    );
  }

}

PaletteView.propTypes = {
  selectedPenValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onSelectPen: PropTypes.func.isRequired,
};
