import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class IconButton extends Component {

  render () {
    const { style, icon, onPress, disabled } = this.props;
    return (
      <button onClick={onPress} disabled={disabled}>
        <i className={`fa fa-${icon}`} />
      </button>
    );
  }

}

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
