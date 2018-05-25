import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GridPropType } from '../prop-types';

export default class GridView extends Component {

  componentDidMount () {
    this.canvas.onclick = e => this.setCellValue(e);
    this.canvas.onmousemove = e => {
      if (e.buttons == 1) {
        this.setCellValue(e);
      }
    };
    this.updateScale(this.props);
    this.updateCanvas(this.props);
  }

  componentDidUpdate () {
    this.updateScale(this.props);
    this.updateCanvas(this.props);
  }

  setCellValue (e) {
    const { penValue, grid, width, height, onUpdate } = this.props;
    if (penValue >= 0 && onUpdate) {
      const gridX = Math.floor((e.clientX - this.canvas.offsetLeft) / this.hScale);
      const gridY = Math.floor((e.clientY - this.canvas.offsetTop) / this.vScale);
      const updatedGrid = grid.clone();
      updatedGrid.set(gridX, gridY, penValue);
      onUpdate(updatedGrid);
    }
  }

  updateScale (props) {
    const { width, height, grid } = props;
    this.hScale = width / grid.width;
    this.vScale = height / grid.height;
  }

  updateCanvas (props) {
    const { width, height, grid, palette } = props;
    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = '#CCCCCC';
    for (let x = 0; x < grid.width; x += 1) {
      for (let y = 0; y < grid.height; y += 1) {
        const scaledX = x * this.hScale;
        const scaledY = y * this.vScale;
        ctx.fillStyle = palette[grid.get(x, y)];
        ctx.fillRect(scaledX, scaledY, this.hScale, this.vScale);
        ctx.strokeRect(scaledX, scaledY, this.hScale, this.vScale);
      }
    }
  }

  render () {
    const { width, height, penValue, onUpdate } = this.props;
    const style = {};
    if (penValue >= 0 && onUpdate) {
      style.cursor = 'pointer';
    }
    return (
      <canvas
        ref={c => { this.canvas = c; }}
        width={width}
        height={height}
        style={style}
        className="grid"
      />
    );
  }

}

GridView.propTypes = {
  grid: GridPropType.isRequired,
  palette: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  penValue: PropTypes.number,
  onUpdate: PropTypes.func,
};
