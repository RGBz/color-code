import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from './buttons/IconButton';

export default class AttemptControls extends Component {

  render () {
    const {
      style,
      frameIndex,
      frameCount,
      onReplayPress,
      onStepForwardPress,
      onStepBackwardPress,
    } = this.props;
    const containerStyle = { display: 'flex', flexDirection: 'row', ...style };
    const hasFrames = frameCount > 0;
    return (
      <div className="controls" style={containerStyle}>
        <div className="frame-index">STEP {frameIndex} / {frameCount}</div>
        <IconButton icon="redo" onPress={onReplayPress} disabled={!hasFrames} />
        <IconButton icon="step-backward" onPress={onStepBackwardPress} disabled={!hasFrames} />
        <IconButton icon="step-forward" onPress={onStepForwardPress} disabled={!hasFrames} />
      </div>
    );
  }

}

AttemptControls.propTypes = {
  frameIndex: PropTypes.number.isRequired,
  frameCount: PropTypes.number.isRequired,
  onReplayPress: PropTypes.func.isRequired,
  onStepForwardPress: PropTypes.func.isRequired,
  onStepBackwardPress: PropTypes.func.isRequired,
};
