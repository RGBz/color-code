import PropTypes from 'prop-types';

export const GridPropType = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  cells: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
});

export const PatternPropType = PropTypes.shape({
  grid: GridPropType.isRequired,
});

export const RulePropType = PropTypes.shape({
  targetValue: PropTypes.number,
  patterns: PropTypes.arrayOf(PatternPropType.isRequired),
})

export const RulebookPropType = PropTypes.shape({
  rules: PropTypes.arrayOf(RulePropType.isRequired),
});

export const PuzzlePropType = PropTypes.shape({
  initialGrid: GridPropType.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  goalPattern: PatternPropType.isRequired,
  maxTicks: PropTypes.number,
});
