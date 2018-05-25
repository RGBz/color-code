import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AddButton extends Component {

  render () {
    const { onPress, color } = this.props;
    return (
      <button onClick={onPress}><i className="fa fa-plus" /></button>
    );
  }

}

AddButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
};
