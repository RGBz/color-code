import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class IconButton extends Component {

  render () {
    const { style, label, className, icon, onPress, disabled } = this.props;
    return (
      <button className={className} onClick={onPress} disabled={disabled} style={style}>
        <img src={icon} />
      </button>
    );
  }

}

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};
