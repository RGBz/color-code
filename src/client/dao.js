import Puzzle from './models/puzzle';

export function savePuzzle (puzzle) {
  localStorage.setItem(puzzle.id, JSON.stringify(puzzle));
  const puzzleIds = loadPuzzleIds();
  if (puzzleIds.indexOf(puzzle.id) === -1) {
    puzzleIds.push(puzzle.id);
    savePuzzleIds(puzzleIds);
  }
}

export function loadPuzzleById (puzzleId) {
  const jsonStr = localStorage.getItem(puzzleId);
  if (jsonStr) {
    return Puzzle.fromJSON(JSON.parse(jsonStr));
  }
  return null;
}

export function removePuzzleById (puzzleId) {
  localStorage.removeItem(puzzleId);
  const puzzleIds = loadPuzzleIds();
  const index = puzzleIds.indexOf(puzzle.id)
  if (index !== -1) {
    puzzleIds.splice(index, 1);
    savePuzzleIds(puzzleIds);
  }
}

export function loadPageOfPuzzles ({ offset = 0, count = 10 } = {}) {
  const puzzleIds = loadPuzzleIds();
  const endIndex = Math.min(puzzleIds.length, offset + count);
  if (offset < endIndex) {
    const puzzleIdsToFetch = puzzleIds.slice(offset, endIndex);
    const puzzles = puzzleIdsToFetch.map(id => loadPuzzleById(id));
    return { offset, nextOffset: endIndex, puzzles };
  }
  return { offset, nextOffset: null, puzzles: [] };
}

function loadPuzzleIds () {
  const jsonStr = localStorage.getItem('puzzle-ids');
  if (jsonStr) {
    return JSON.parse(jsonStr);
  }
  return [];
}

function savePuzzleIds (puzzleIds = []) {
  localStorage.setItem('puzzle-ids', JSON.stringify(puzzleIds));
}
