import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import PuzzlePackListView from './views/PuzzlePackListView';
import PuzzleView from './views/PuzzleView';
import PuzzleEditor from './views/PuzzleEditor';
import TutorialScreen from './views/TutorialScreen';

import Player from './models/Player';
import PuzzlePack from './models/PuzzlePack';
import Puzzle from './models/Puzzle';
import Grid from './models/Grid';
import Rule from './models/Rule';
import Rulebook from './models/Rulebook';
import Pattern from './models/Pattern';
import { savePuzzlePacks, loadPuzzlePacks } from './dao';

const isEditable = false;

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      player: null,
      puzzlePacks: loadPuzzlePacks(),
      mode: 'list',
      selectedPuzzle: null,
    };
  }

  componentDidMount () {
    this.fetchPlayer();
  }

  fetchPlayer () {
    this.setState({ loaded: true, player: Player.fetchMe() });
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
    const { player, puzzlePacks } = this.state;
    return (
      <PuzzlePackListView
        player={player}
        puzzlePacks={puzzlePacks}
        updatePuzzlePack={puzzlePack => this.savePuzzlePack(puzzlePack)}
        navigateToPlayPuzzle={selectedPuzzle => this.navigateToPlayPuzzle(selectedPuzzle)}
        navigateToEditPuzzle={selectedPuzzle => this.navigateToEditPuzzle(selectedPuzzle)}
        isEditable={isEditable}
        onTutorialPressed={() => this.setState({ mode: 'tutorial' })}
      />
    );
  }

  renderPuzzle () {
    const { player, selectedPuzzle } = this.state;
    return (
      <PuzzleView
        player={player}
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

  renderTutorialScreen () {
    return (
      <TutorialScreen
        onClose={() => this.setState({ mode: 'list' })}
      />
    );
  }

  render () {
    const { loaded, player, mode } = this.state;
    if (!loaded) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, color: '#ccc' }}>
          loading...
        </div>
      );
    }
    switch (mode) {
      case 'tutorial': return this.renderTutorialScreen();
      case 'list': return this.renderPuzzlePackList();
      case 'play': return this.renderPuzzle();
      case 'edit': return this.renderPuzzleEditor();
    }
  }

}

Modal.setAppElement('#root');
ReactDOM.render(<App />, document.getElementById('root'));
