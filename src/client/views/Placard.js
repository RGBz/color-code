import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Placard extends Component {

  render () {
    const { label } = this.props;
    return (
      <div className="placard">{label}</div>
    );
  }

}

Placard.propTypes = {
  label: PropTypes.string.isRequired,
};
