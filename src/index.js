import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PuzzleView from './views/PuzzleView';
import PuzzleEditor from './views/PuzzleEditor';
import PatternEditor from './views/PatternEditor';
import RuleEditor from './views/RuleEditor';

import Puzzle from './models/puzzle';
import Grid from './models/grid';
import Rule from './models/rule';
import Ruleset from './models/ruleset';
import Pattern from './models/pattern';

const DEFAULT_PALETTE = [
  'white',
  'black',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'brown',
];

class App extends Component {

  constructor (props) {
    super(props);
    const puzzleJson = localStorage.getItem('puzzle');
    if (puzzleJson) {
      console.log(JSON.parse(puzzleJson))
    }
    const puzzle = puzzleJson ?
      Puzzle.fromJSON(JSON.parse(puzzleJson)) :
      new Puzzle({
        initialGrid: new Grid(32, 24),
        initialRuleset: new Ruleset(),
        goalPattern: new Pattern(new Grid(32, 24)),
        illegalPatterns: [],
        palette: DEFAULT_PALETTE,
      });
    this.state = {
      grid: new Grid(32, 24),
      pattern: new Pattern(new Grid(5, 5)),
      rule: new Rule(),
      puzzle,
    };
  }

  save (puzzle) {
    localStorage.setItem('puzzle', JSON.stringify(puzzle));
    this.setState({ puzzle });
  }

  renderPuzzle () {
    const { puzzle } = this.state;
    return (
      <PuzzleView puzzle={puzzle} />
    );
  }

  renderPuzzleEditor () {
    const { puzzle } = this.state;
    return (
      <PuzzleEditor
        puzzle={puzzle}
        onSave={puzzle => this.save(puzzle)}
      />
    );
  }

  updatePattern (pattern) {
    this.setState({ grid: pattern.grid });
  }

  renderRuleEditor () {
    return (
      <RuleEditor
        penValue={1}
        rule={this.state.rule}
        onUpdate={rule => this.setState({ rule })}
      />
    );
  }

  renderPatternEditor () {
    return (
      <PatternEditor
        penValue={1}
        pattern={this.state.pattern}
        onUpdate={pattern => this.setState({ pattern })}
      />
    );
  }

  render () {
    return this.renderPuzzleEditor();
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
