import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PuzzleList from './views/PuzzleList';
import PuzzleView from './views/PuzzleView';
import PuzzleEditor from './views/PuzzleEditor';

import Puzzle from './models/puzzle';
import Grid from './models/grid';
import Rule from './models/rule';
import Ruleset from './models/ruleset';
import Pattern from './models/pattern';
import { loadPageOfPuzzles, savePuzzle } from './dao';

const DEFAULT_PUZZLE = new Puzzle({
  initialGrid: new Grid(9, 9),
  initialRuleset: new Ruleset(),
  goalPattern: new Pattern(new Grid(9, 9)),
  illegalPatterns: [],
  palette: [
    '#F1F1F1', // neutral gray
    '#D0011B', // red
    '#FFA000', // orange
    '#F8E81C', // yellow
    '#00C467', // green
    '#1190EE', // blue
    '#9012FE', // purple
    '#8B572A', // brown
    '#90A4AE', // gray
    '#000000', // black
    '#FFFFFF', // white
  ],
});

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      puzzles: loadPageOfPuzzles({ count: 100 }).puzzles,
      mode: 'list',
      selectedPuzzle: null,
    };
  }

  createPuzzle () {
    const selectedPuzzle = DEFAULT_PUZZLE.clone();
    this.setState({ selectedPuzzle, mode: 'edit' });
  }

  save (selectedPuzzle) {
    savePuzzle(selectedPuzzle);
    this.setState({ selectedPuzzle, puzzles: loadPageOfPuzzles({ count: 100 }).puzzles });
  }

  attemptPuzzle (selectedPuzzle) {
    // window.history.pushState({ }, "ColorCode - Attempt", `/attempt/${puzzleId}`);
    this.setState({ mode: 'attempt', selectedPuzzle });
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
        onSelectPuzzle={selectedPuzzle => this.attemptPuzzle(selectedPuzzle)}
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
      case 'attempt': return this.renderPuzzle();
      case 'edit': return this.renderPuzzleEditor();
    }
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
