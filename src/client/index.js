import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import PuzzleList from './views/PuzzleList';
import PuzzleView from './views/PuzzleView';
import PuzzleEditor from './views/PuzzleEditor';

import Puzzle from './models/puzzle';
import Grid from './models/grid';
import Rule from './models/rule';
import Rulebook from './models/rulebook';
import Pattern from './models/pattern';
import puzzles from './puzzles';

const DEFAULT_PUZZLE = new Puzzle({
  initialGrid: new Grid({ width: 9, height: 9 }),
  goalPattern: new Pattern(new Grid({ width: 9, height: 9 })),
  palette: [
    '#FFFFFF', // white
    '#90A4AE', // gray
    '#000000', // black
    '#D0011B', // red
    '#FFA000', // orange
    '#F8E81C', // yellow
    '#00C467', // green
    '#1190EE', // blue
    '#9012FE', // purple
  ],
});

class App extends Component {

  constructor (props) {
    super(props);
    this.state = { puzzles: puzzles.map(Puzzle.fromJSON), mode: 'list', selectedPuzzle: null };
  }

  createPuzzle () {
    const selectedPuzzle = DEFAULT_PUZZLE.clone();
    this.setState({ selectedPuzzle, mode: 'edit' });
  }

  async save (puzzle) {
    console.log('saving', puzzle)
    const isExistingPuzzle = this.state.puzzles.some(p => p.id === puzzle.id);
    const updatedPuzzles = isExistingPuzzle ?
      this.state.puzzles.map(p => {
        if (p.id === puzzle.id) {
          return puzzle;
        }
        return p;
      }) :
      this.state.puzzles.concat([puzzle]);
    console.log('updated puzzles', updatedPuzzles)
    try {
      await fetch('/puzzles', {
        method: 'POST',
        body: JSON.stringify(updatedPuzzles),
        headers: { 'Content-Type': 'application/json' }
      });
      this.setState({ selectedPuzzle: puzzle, puzzles: updatedPuzzles });
    } catch (err) {
      console.error(err);
    }
  }

  executeRulebook (selectedPuzzle) {
    // window.history.pushState({ }, "ColorCode - Execution", `/execution/${puzzleId}`);
    this.setState({ mode: 'execution', selectedPuzzle });
  }

  editPuzzle (selectedPuzzle) {
    // window.history.pushState({ }, "ColorCode - Edit", `/edit/${puzzleId}`);
    this.setState({ mode: 'edit', selectedPuzzle });
  }

  renderPuzzleList () {
    const { puzzles } = this.state;
    return (
      <PuzzleList
        puzzles={puzzles}
        onCreatePuzzle={() => this.createPuzzle()}
        onSelectPuzzle={selectedPuzzle => this.executeRulebook(selectedPuzzle)}
        onEditPuzzle={selectedPuzzle => this.editPuzzle(selectedPuzzle)}
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
        onSave={puzzle => this.save(puzzle)}
        onBackPress={() => this.setState({ mode: 'list' })}
      />
    );
  }

  render () {
    switch (this.state.mode) {
      case 'list': return this.renderPuzzleList();
      case 'execution': return this.renderPuzzle();
      case 'edit': return this.renderPuzzleEditor();
    }
  }

}

Modal.setAppElement('#root');
ReactDOM.render(<App />, document.getElementById('root'));
