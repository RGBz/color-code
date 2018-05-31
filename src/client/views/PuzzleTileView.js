import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';
import IconButton from './buttons/IconButton';

export default class PuzzleTileView extends Component {

  renderAccolade (type, completed) {
    return (<img key={type} src={`/images/${type}-${completed ? 'solid' : 'stroke'}.png`} />);
  }

  render () {
    const { puzzle, onSelectPuzzle, onEditPuzzle } = this.props;
    const grid = puzzle.thumbnailPreviewType === 'initial' ?
      puzzle.initialGrid : puzzle.goalPattern.grid;
    return (
      <div className="puzzle-tile">
        <div onClick={() => onSelectPuzzle(puzzle)}>
          <GridView
            grid={grid}
            width={160}
            height={160}
            palette={puzzle.palette}
            showGrid={false}
          />
          <div className="puzzle-tile-name">{puzzle.name}</div>
          <div className="accolades">
            {['check', 'steps', 'pattern'].map((type, i) => {
              const completed = (Math.random() * 100) > 50;
              return this.renderAccolade(type, completed);
            })}
          </div>
        </div>
        <IconButton icon="pencil-alt" onPress={() => onEditPuzzle(puzzle)} />
      </div>
    );
  }

}

PuzzleTileView.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  onSelectPuzzle: PropTypes.func.isRequired,
  onEditPuzzle: PropTypes.func.isRequired,
};
