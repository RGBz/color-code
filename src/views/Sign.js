import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Sign extends Component {

  render () {
    return (
      <div className="sign" style={this.props.style}>
        {this.props.label}
      </div>
    );
  }

}

Sign.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
};
