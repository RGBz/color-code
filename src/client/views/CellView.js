import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CellView extends Component {

  render () {
    const { penValue, palette, onClick, style } = this.props;
    const backgroundColor = penValue >= 0 ? palette[penValue] : '#F1F1F1';
    const divStyle = Object.assign({ backgroundColor }, style);
    return (
      <div className="cell" style={divStyle} onClick={onClick} />
    );
  }

}

CellView.propTypes = {
  penValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onClick: PropTypes.func,
};
