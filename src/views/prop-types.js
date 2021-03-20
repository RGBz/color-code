import PropTypes from 'prop-types';
import Rulebook from '../models/Rulebook';
import Pattern from '../models/Pattern';
import Grid from '../models/Grid';
import Rule from '../models/Rule';
import Puzzle from '../models/Puzzle';
import PuzzlePack from '../models/PuzzlePack';
import Solution from '../models/Solution';
import Player from '../models/Player';

export const GridPropType = PropTypes.instanceOf(Grid);
export const PatternPropType = PropTypes.instanceOf(Pattern);
export const RulePropType = PropTypes.instanceOf(Rule);
export const RulebookPropType = PropTypes.instanceOf(Rulebook);
export const PuzzlePropType = PropTypes.instanceOf(Puzzle);
export const PuzzlePackPropType = PropTypes.instanceOf(PuzzlePack);
export const SolutionPropType = PropTypes.instanceOf(Solution);
export const PlayerPropType = PropTypes.instanceOf(Player);
