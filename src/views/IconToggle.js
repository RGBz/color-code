import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class IconButton extends Component {

  render () {
    const { off, on, label, value, onToggle, style } = this.props;
    const isOff = off.value === value;
    const slideStyle = { justifyContent: isOff ? 'flex-start' : 'flex-end' };
    return (
      <div className="toggle" onClick={() => onToggle(isOff ? on.value : off.value)} style={style}>
        <div className="label">{label}</div>
        <div className="row">
          <i className={`fa fa-${off.icon}`} />
          <div className="slide" style={slideStyle}>
            <div className="knob" />
          </div>
          <i className={`fa fa-${on.icon}`} />
        </div>
      </div>
    );
  }

}

IconButton.propTypes = {
  off: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  on: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  style: PropTypes.object,
};
