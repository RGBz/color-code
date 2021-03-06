import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PaletteView extends Component {

  renderSwatches () {
    const swatches = [];
    for (let i = 0; i < this.props.palette.length; i++) {
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
    if (penValue === -1) {
      return (
        <img key={penValue} className="inner" src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Feraser.png?1527980160865" />
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
        {this.renderSwatch(-1)}
      </div>
    );
  }

}

PaletteView.propTypes = {
  selectedPenValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onSelectPen: PropTypes.func.isRequired,
};
