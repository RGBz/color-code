import puzzlePacksRaw from './puzzle-packs';
import PuzzlePack from './models/PuzzlePack';

export async function savePuzzlePacks (puzzlePacks) {
  const puzzles = {};
  puzzlePacks.forEach(pack => pack.puzzles.forEach(puzzle => { puzzles[puzzle.id] = puzzle; }));
  const json = {
    packs: puzzlePacks.map(pack => ({
      ...pack.toJSON(),
      puzzles: undefined,
      puzzleIds: pack.puzzles.map(puzzle => puzzle.id),
    })),
    puzzles,
  };
  await fetch('/puzzle-packs', {
    method: 'POST',
    body: JSON.stringify(json),
    headers: { 'Content-Type': 'application/json' }
  });
  return puzzlePacks;
}

export function loadPuzzlePacks () {
  const puzzlePacksJson = puzzlePacksRaw.packs.map(pp => ({
    ...pp,
    puzzles: pp.puzzleIds.map(id => puzzlePacksRaw.puzzles[id]),
  }));
  return puzzlePacksJson.map(PuzzlePack.fromJSON);
}
