const COLORS = ['transparent', 'white', 'red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'purple', 'brown', 'gray', 'black'];
const MAX_VALUE = COLORS.length - 1;

function rand(min, max) {
  if (min && max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  return Math.floor(Math.random() * min);
}

function prob(p) {
  return Math.floor(Math.random() * 100) < p ? 1 : 0;
}

function ones(width, height) {
  const grid = [];
  for (let y = 0; y < height; y += 1) {
    const row = [];
    grid.push(row);
    for (let x = 0; x < width; x += 1) {
      row.push(1);
    }
  }
  return grid;
}

class Biome {

  constructor(ruleset, width, height, scale) {
    this.ruleset = ruleset;
    this.width = width;
    this.height = height;
    this.reset();
    this.scale = scale;
    this.isRunning = true;
    this.listeners = new Set();
  }

  toggleRunning() {
    this.isRunning = !this.isRunning;
  }

  reset() {
    this.body = ones(this.width, this.height);
    this.buffer = ones(this.width, this.height);
  }

  setCellValue(x, y, value) {
    this.body[y][x] = value;
    return this;
  }

  getCellValue(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    }
    return this.body[y][x];
  }

  tick() {
    if (this.isRunning) {
      const clone = [];
      for (let y = 0; y < this.height; y += 1) {
        for (let x = 0; x < this.width; x += 1) {
          this.buffer[y][x] = this.ruleset.getNextCellValue(this, x, y);
        }
      }
      const swap = this.body;
      this.body = this.buffer;
      this.buffer = swap;
    }
    return this;
  }

  draw(ctx) {
    const scale = this.scale;
    ctx.clearRect(0, 0, this.width, this.height);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const value = this.body[y][x];
        ctx.fillStyle = COLORS[value];
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    return this;
  }

}

class PetriDish extends React.Component {

  constructor(props) {
    super(props);
    this.biome = new Biome(props.ruleset, props.width, props.height, props.scale);
  }

  componentDidMount() {
    const scale = this.props.scale;
    this.canvas.onmousedown = () => { this.isMousDown = true; }
    this.canvas.onmouseup = () => { this.isMousDown = false; }
    this.canvas.onclick = e => {
      const x = (e.clientX - this.canvas.offsetLeft);
      const y = (e.clientY - this.canvas.offsetTop);
      this.biome.setCellValue(Math.floor(x / scale), Math.floor(y / scale), this.props.newCellValue);
    };
    this.canvas.onmousemove = e => {
      if (this.isMousDown) {
        const x = (e.clientX - this.canvas.offsetLeft);
        const y = (e.clientY - this.canvas.offsetTop);
        this.biome.setCellValue(Math.floor(x / scale), Math.floor(y / scale), this.props.newCellValue);
      }
    };
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, this.props.width, this.props.height);
    const tick = () => {
      this.biome.tick().draw(ctx);
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  }

  componentWillReceiveProps(nextProps) {
    this.biome.ruleset = nextProps.ruleset;
  }

  clear() {
    this.biome.reset();
  }

  toggleRunning() {
    this.biome.toggleRunning();
    this.setState({});
  }

  renderButton(icon, onClick) {
    return (
      <button style={{ display: 'block', marginRight: 5 }} onClick={onClick}>
        <i class={`fas fa-${icon}`}/>
      </button>
    );
  }

  renderStatusIcon(icon) {
    return (
      <div className="status-icon" style={{ display: 'block', marginRight: 5 }}>
        <i class={`fas fa-${icon}`}/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <canvas
          ref={c => { this.canvas = c; }}
          width={this.props.width * this.props.scale}
          height={this.props.height * this.props.scale}
          style={{ cursor: 'pointer', margin: '0 10px', borderRadius: 5 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', margin: 10 }}>
            {this.biome.isRunning ?
              this.renderStatusIcon('play') :
              this.renderButton('play', () => this.toggleRunning())
            }
            {!this.biome.isRunning ?
              this.renderStatusIcon('pause') :
              this.renderButton('pause', () => this.toggleRunning())
            }
          </div>
          <button
            style={{ display: 'block', margin: 10 }}
            onClick={() => this.clear()}>
            <span><i class="fas fa-bomb"/> clear</span>
          </button>
        </div>
      </div>
    );
  }

}

PetriDish.defaultProps = { newCellValue: 1 };
