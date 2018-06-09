import Solution from './Solution';

export default class Player {

  static async fetchMe () {
    return Player.fromJSON(await get('/player'));
  }

  static fromJSON ({ username, solutions }) {
    return new Player({ username, solutions: solutionsFromJSON(solutions) });
  }

  constructor ({ username, solutions = {} } = {}) {
    this.username = username;
    this.solutions = solutions;
  }

  get score () {
    let score = 0;
    for (const solution of Object.values(this.solutions)) {
      if (solution.completed.timestamp) {
        score += 3;
      }
      if (solution.patterns.timestamp) {
        score += 1;
      }
      if (solution.steps.timestamp) {
        score += 1;
      }
    }
    return score;
  }

  async login (username, password) {
    const { solutions } = await post('/login', { username, password });
    this.username = username;
    this.solutions = solutionsFromJSON(solutions);
  }

  async signUp (username, password) {
    this.username = username;
    await post('/player', { username, password });
    return this.save();
  }

  getSolutionByPuzzleId (puzzleId) {
    if (!this.solutions[puzzleId]) {
      this.solutions[puzzleId] = new Solution({ puzzleId });
    }
    return this.solutions[puzzleId];
  }

  updateSolution (solution) {
    this.solutions[solution.puzzleId] = solution;
    return this.save();
  }

  save () {
    if (this.username) {
      return put('/player', this);
    }
  }

  logout () {
    return post('/logout');
  }

  toJSON () {
    return {
      username: this.username,
      solutions: this.solutions,
    };
  }

}

function get (url) {
  return httpRequest({ url, method: 'GET' });
}

function put (url, body) {
  return httpRequest({ url, method: 'PUT', body });
}

function post (url, body) {
  return httpRequest({ url, method: 'POST', body });
}

async function httpRequest ({ url, method, body }) {
  const res = await fetch(url, {
    method: method,
    mode: 'same-origin',
    redirect: 'follow',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
  return res.json();
}

function solutionsFromJSON (solutionsJson) {
  const solutions = {};
  Object.keys(solutionsJson).forEach(puzzleId => {
    solutions[puzzleId] = Solution.fromJSON(solutionsJson[puzzleId]);
  });
  return solutions;
}