import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType, RulebookPropType } from '../prop-types';
import PuzzleAttempt from '../models/puzzle-attempt';
import GridView from './GridView';

export default class PuzzleAttemptPlayer extends Component {

  constructor (props) {
    super(props);
    const { puzzle, rulebook } = props;
    this.state = { attempt: new PuzzleAttempt(puzzle, rulebook), frameIndex: 0 };
  }

  componentDidMount () {
    this.buildAttempt(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.buildAttempt(nextProps);
  }

  componentWillUnmount () {
    this.pause();
  }

  buildAttempt (props) {
    const { puzzle, rulebook } = props;
    const attempt = new PuzzleAttempt(puzzle, rulebook);
    attempt.run();
    this.setState({ attempt, frameIndex: 0 });
  }

  play () {
    this.ticker = setInterval(() => this.stepForward(), 100);
  }

  pause () {
    if (this.ticker) {
      clearTimeout(this.ticker);
      this.ticker = null;
    }
  }

  reset () {
    this.pause();
    this.setState({ frameIndex: 0 });
  }

  replay () {
    this.reset();
    this.play();
  }

  stepForward () {
    const { frameIndex, attempt } = this.state;
    if (frameIndex < attempt.frameCount) {
      this.setState({ frameIndex: frameIndex + 1 });
    } else {
      this.pause();
      this.setState({});
    }
  }

  stepBackward () {
    const { frameIndex } = this.state;
    if (frameIndex > 0) {
      this.setState({ frameIndex: frameIndex - 1 });
    }
  }

  render () {
    const { puzzle: { palette } } = this.props;
    const { attempt, frameIndex } = this.state;
    const grid = attempt.getFrame(frameIndex);
    const isAtTheEnd = frameIndex === attempt.frameCount;
    const isPlaying = !!this.ticker;
    const isAtTheBeginning = frameIndex === 0;
    return (
      <div className="puzzle-attempt-player">
        <GridView
          grid={grid}
          width={grid.width * 10}
          height={grid.height * 10}
          palette={palette}
        />
        <div>
          <span>TICKS {frameIndex}</span>
          {isAtTheEnd && attempt.succeeded && (<span>YOU WIN!</span>)}
          {isAtTheEnd && (attempt.failed || !attempt.succeeded) && (<span>FAIL</span>)}
        </div>
        <div>
          {!isAtTheBeginning && (<button onClick={() => this.reset()}>Reset</button>)}
          {isAtTheEnd && (<button onClick={() => this.replay()}>Replay</button>)}
          {!isAtTheEnd && !isPlaying && (<button onClick={() => this.play()}>Play</button>)}
          {isPlaying && (<button onClick={() => this.pause()}>Pause</button>)}
          {!isAtTheBeginning && !isPlaying && (<button onClick={() => this.stepBackward()}>Step Backward</button>)}
          {!isAtTheEnd && !isPlaying && (<button onClick={() => this.stepForward()}>Step Forward</button>)}
        </div>
      </div>
    );
  }

}

PuzzleAttemptPlayer.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  rulebook: RulebookPropType.isRequired,
};
