import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import PuzzlePackListView from './views/PuzzlePackListView';
import PuzzleView from './views/PuzzleView';
import PuzzleEditor from './views/PuzzleEditor';

import PuzzlePack from './models/PuzzlePack';
import Puzzle from './models/Puzzle';
import Grid from './models/Grid';
import Rule from './models/Rule';
import Rulebook from './models/Rulebook';
import Pattern from './models/Pattern';
import { savePuzzlePacks, loadPuzzlePacks } from './dao';

// Object.keys(localStorage).forEach(k => localStorage.removeItem(k));

const isEditable = false;

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      puzzlePacks: loadPuzzlePacks(),
      mode: 'list',
      selectedPuzzle: null,
    };
  }

  async savePuzzlePacks (updatedPuzzlePacks) {
    try {
      this.setState({ puzzlePacks: await savePuzzlePacks(updatedPuzzlePacks) });
    } catch (err) {
      console.error(err);
    }
  }

  savePuzzlePack (puzzlePack) {
    this.savePuzzlePacks(this.state.puzzlePacks.map(pp => {
      if (pp.id === puzzlePack.id) {
        return puzzlePack;
      }
      return pp;
    }));
  }

  savePuzzle (puzzle) {
    const puzzlePack = this.state.puzzlePacks.find(pp =>
      pp.puzzles.some(p => p.id === puzzle.id)
    ).clone();
    puzzlePack.puzzles = puzzlePack.puzzles.map(p => {
      if (p.id === puzzle.id) {
        return puzzle;
      }
      return p;
    });
    this.setState({ selectedPuzzle: puzzle });
    this.savePuzzlePack(puzzlePack);
  }

  navigateToPlayPuzzle (selectedPuzzle) {
    // window.history.pushState({ }, "ColorCode - Execution", `/play/${puzzleId}`);
    this.setState({ mode: 'play', selectedPuzzle });
  }

  navigateToEditPuzzle (selectedPuzzle) {
    // window.history.pushState({ }, "ColorCode - Edit", `/edit/${puzzleId}`);
    this.setState({ mode: 'edit', selectedPuzzle });
  }

  renderPuzzlePackList () {
    const { puzzlePacks } = this.state;
    return (
      <PuzzlePackListView
        puzzlePacks={puzzlePacks}
        updatePuzzlePack={puzzlePack => this.savePuzzlePack(puzzlePack)}
        navigateToPlayPuzzle={selectedPuzzle => this.navigateToPlayPuzzle(selectedPuzzle)}
        navigateToEditPuzzle={selectedPuzzle => this.navigateToEditPuzzle(selectedPuzzle)}
        isEditable={isEditable}
      />
    );
  }

  renderPuzzle () {
    const { selectedPuzzle } = this.state;
    return (
      <PuzzleView
        puzzle={selectedPuzzle}
        onBackPress={() => this.setState({ mode: 'list' })}
      />
    );
  }

  renderPuzzleEditor () {
    const { selectedPuzzle } = this.state;
    return (
      <PuzzleEditor
        puzzle={selectedPuzzle}
        onSave={puzzle => this.savePuzzle(puzzle)}
        onBackPress={() => this.setState({ mode: 'list' })}
      />
    );
  }

  render () {
    switch (this.state.mode) {
      case 'list': return this.renderPuzzlePackList();
      case 'play': return this.renderPuzzle();
      case 'edit': return this.renderPuzzleEditor();
    }
  }

}

Modal.setAppElement('#root');
ReactDOM.render(<App />, document.getElementById('root'));
