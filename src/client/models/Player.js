import Solution from './Solution';

export default class Player {

  static async signUp (username, password) {
    return Player.fromJSON(await post('/player', { username, password }));
  }

  static async login (username, password) {
    return Player.fromJSON(await post('/login', { username, password }));
  }

  static async fetchMe () {
    return Player.fromJSON(await get('/player'));
  }

  static fromJSON ({ username, solutions }) {
    Object.keys(solutions).forEach(puzzleId => {
      solutions[puzzleId] = Solution.fromJSON(solutions[puzzleId]);
    });
    return new Player({ username, solutions });
  }

  constructor ({ username, solutions }) {
    this.username = username;
    this.solutions = solutions;
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
    return put('/player', this);
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