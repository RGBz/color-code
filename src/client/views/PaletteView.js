import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PaletteView extends Component {

  renderSwatches () {
    const swatches = [];
    for (let i = 1; i < this.props.palette.length; i++) {
      swatches.push(this.renderSwatch(i));
    }
    return swatches;
  }

  renderSwatch (penValue) {
    const { selectedPenValue, onSelectPen } = this.props;
    const className = penValue === selectedPenValue ? 'swatch selected' : 'swatch';
    return (
      <div className={className} onClick={() => onSelectPen(penValue)}>
        {this.renderSwatchInner(penValue)}
      </div>
    );
  }

  renderSwatchInner (penValue) {
    const { palette } = this.props;
    if (penValue === 0) {
      return (
        <img key={penValue} className="inner" src="/images/eraser.png" />
      );
    } else {
      return (
        <div key={penValue} className="inner" style={{ backgroundColor: palette[penValue] }} />
      );
    }
  }

  render () {
    const { selectedPenValue, onSelectPen, palette } = this.props;
    return (
      <div className="palette">
        <div className="colors">
          {this.renderSwatches()}
        </div>
        {this.renderSwatch(0)}
      </div>
    );
  }

}

PaletteView.propTypes = {
  selectedPenValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onSelectPen: PropTypes.func.isRequired,
};
