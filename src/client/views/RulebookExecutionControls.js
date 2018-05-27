import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from './buttons/IconButton';

export default class RulebookExecutionControls extends Component {

  render () {
    const {
      style,
      stepIndex,
      stepCount,
      onReplayPress,
      onStepForwardPress,
      onStepBackwardPress,
    } = this.props;
    const containerStyle = { display: 'flex', flexDirection: 'row', ...style };
    const hasSteps = stepCount > 0;
    return (
      <div className="controls" style={containerStyle}>
        <div className="step-index">STEP {stepIndex} / {stepCount}</div>
        <IconButton icon="redo" onPress={onReplayPress} disabled={!hasSteps} />
        <IconButton icon="step-backward" onPress={onStepBackwardPress} disabled={!hasSteps} />
        <IconButton icon="step-forward" onPress={onStepForwardPress} disabled={!hasSteps} />
      </div>
    );
  }

}

RulebookExecutionControls.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
  onReplayPress: PropTypes.func.isRequired,
  onStepForwardPress: PropTypes.func.isRequired,
  onStepBackwardPress: PropTypes.func.isRequired,
};
