import React, { Component } from 'react';
import PropTypes from 'prop-types';

const imgUrls = {
  completed: {
    solid: 'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fcompleted-solid.png?1527979637649',
    stroke: 'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fcompleted-stroke.png?1527979637724',
  },
  steps: {
    solid: 'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fsteps-solid.png?1527979638038',
    stroke: 'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fsteps-stroke.png?1527979638190',
  },
  patterns: {
    solid: 'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fpatterns-solid.png?1527979637787',
    stroke: 'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fpatterns-stroke.png?1527979638127',
  },
}

export default class AchievementIcon extends Component {

  render () {
    return (
      <img src={imgUrls[this.props.type][this.props.styling]} />
    );
  }

}

AchievementIcon.propTypes = {
  type: PropTypes.string.isRequired,
  styling: PropTypes.oneOf(['solid', 'stroke']).isRequired,
};
