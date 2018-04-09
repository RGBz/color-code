
class Swatch extends React.Component {

  render() {
    const borderStyle = {
      padding: 2,
      border: this.props.selected ? '2px solid white' : '2px solid transparent',
      borderRadius: 23,
    }
    const colorStyle = {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: this.props.color,
      border: '1px solid rgba(0,0,0,0.15)',
      boxSizing: 'border-box',
      cursor: 'pointer',
    };
    return (
      <div style={borderStyle}>
        <div onClick={() => this.props.onClick(this.props.color)} style={colorStyle} />
      </div>
    );
  }

}

class Palette extends React.Component {

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        {COLORS.map(c => (
          <Swatch
            key={c}
            selected={this.props.selectedColor === c}
            color={c}
            onClick={color => this.props.onSelectColor(color)}
          />
        ))}
      </div>
    );
  }

}

class ConditionGrid extends React.Component {

  render() {
    const rowStyle = { display: 'flex' };
    return (
      <div style={{ marginRight: 10 }}>
        {this.props.rows.map((row, y) => {
          return (
            <div key={y} style={rowStyle}>
              {row.map((cellValue, x) => {
                const isCenterCell =
                  x === Math.floor(row.size / 2) && y === Math.floor(this.props.rows.size / 2);
                const cellStyle = {
                  width: 10,
                  height: 10,
                  backgroundColor: COLORS[cellValue],
                  border: isCenterCell ? '1px solid black' : '1px solid rgba(0,0,0,0.15)',
                  borderRadius: 2,
                  margin: 1,
                  cursor: 'pointer',
                };
                return (
                  <div
                    key={x}
                    style={cellStyle}
                    onClick={() => this.props.onCellClick(x, y)}
                  />
                );
              })}
            </div>
          );
        })}
        <br/>
        <button onClick={() => this.props.onDelete()}><i class="fas fa-minus"/></button>
      </div>
    );
  }

}

const EMPTY_CONDITION = Immutable.fromJS([
  // [0,0,0],
  // [0,0,0],
  // [0,0,0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
]);

class RuleRow extends React.Component {

  onConditionCellClick(conditionIndex, x, y) {
    const rule = this.props.rule;
    const condition = rule.get('conditions').get(conditionIndex);
    const row = condition.get(y);
    const updatedRow = row.set(x, this.props.newCellValue);
    const updatedCondition = condition.set(y, updatedRow);
    const updatedConditions = rule.get('conditions').set(conditionIndex, updatedCondition);
    const updatedRule = rule.set('conditions', updatedConditions);
    this.props.onChange(updatedRule);
  }

  onTargetValueClick() {
    const updatedRule = this.props.rule.set('targetValue', this.props.newCellValue);
    this.props.onChange(updatedRule);
  }

  addCondition() {
    const updatedRule = this.props.rule.set('conditions', this.props.rule.get('conditions').push(EMPTY_CONDITION));
    this.props.onChange(updatedRule);
  }

  removeCondition(index) {
    const updatedRule = this.props.rule.set('conditions', this.props.rule.get('conditions').remove(index));
    this.props.onChange(updatedRule);
  }

  render() {
    const targetValueStyle = {
      width: 40,
      height: 40,
      margin: '0 10px',
      cursor: 'pointer',
      borderRadius: 5,
      backgroundColor: COLORS[this.props.rule.get('targetValue')],
      border: '1px solid rgba(0,0,0,0.15)',
    };
    return (
      <div style={{ display: 'flex', padding: '10px 0', borderTop: '1px solid rgba(0,0,0,0.15)', }}>
        <div>
          <button onClick={() => this.props.onMoveUp()}><i class="fas fa-arrow-up"/></button><br/>
          <button onClick={() => this.props.onMoveDown()}><i class="fas fa-arrow-down"/></button><br/><br/>
          <button onClick={() => this.props.onDelete()} ><i class="fas fa-bomb"/></button>
        </div>
        <div>
          <div style={targetValueStyle} onClick={() => this.onTargetValueClick()} />
        </div>
        {this.props.rule.get('conditions').map((c, i) =>
          <ConditionGrid
            key={i}
            rows={c}
            onCellClick={(x, y) => this.onConditionCellClick(i, x, y)}
            onDelete={() => this.removeCondition(i)}
          />
        )}
        <button onClick={() => this.addCondition()} >
          <i class="fas fa-plus"/>
        </button>
      </div>
    );
  }

}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ruleset: Immutable.List(), selectedColor: 'red' };
  }

  selectColor(selectedColor) {
    this.setState({ selectedColor });
  }

  addRule() {
    const rule = Immutable.Map({ targetValue: 0, conditions: Immutable.List([EMPTY_CONDITION]) });
    this.setState({ ruleset: this.state.ruleset.push(rule) });
  }

  removeRule(index) {
    this.setState({ ruleset: this.state.ruleset.remove(index) });
  }

  setRule(index, rule) {
    const ruleset = this.state.ruleset.set(index, rule);
    this.setState({ ruleset });
  }

  removeRule(index) {
    const ruleset = this.state.ruleset.remove(index);
    this.setState({ ruleset });
  }

  moveRuleUp(index) {
    if (index > 0) {
      const rule = this.state.ruleset.get(index);
      const ruleset = this.state.ruleset.remove(index).insert(index - 1, rule);
      this.setState({ ruleset });
    }
  }

  moveRuleDown(index) {
    if (index < this.state.ruleset.size - 1) {
      const rule = this.state.ruleset.get(index);
      const ruleset = this.state.ruleset.remove(index).insert(index + 1, rule);
      this.setState({ ruleset });
    }
  }

  render() {
    return (
      <div>
        <Palette
          selectedColor={this.state.selectedColor}
          onSelectColor={c => this.selectColor(c)}
        />
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <PetriDish
            newCellValue={COLORS.indexOf(this.state.selectedColor)}
            ruleset={Ruleset.fromJSON(this.state.ruleset.toJSON())} width={50} height={40} scale={10}
          />
          <div>
            {this.state.ruleset.map((r, i) => (
              <RuleRow
                key={i}
                rule={r}
                onChange={rule => this.setRule(i, rule)}
                onDelete={() => this.removeRule(i)}
                onMoveUp={() => this.moveRuleUp(i)}
                onMoveDown={() => this.moveRuleDown(i)}
                newCellValue={COLORS.indexOf(this.state.selectedColor)}
              />
            ))}
            <br/>
            <button onClick={() => this.addRule()}><i class="fas fa-plus"/> rule</button>
          </div>
        </div>
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
