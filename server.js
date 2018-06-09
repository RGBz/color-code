const fs = require('fs');
const path = require('path');
const util = require('util');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { PORT = 3000, ENCRYPTION_KEY = 'test' } = process.env;

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const usersDir = path.join(__dirname, 'users');

const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await fetchPlayerByUsername(username);
  if (!user || user.passwordHash !== hash(password)) {
    return res.status(403).json({ error: 'Invalid username or password' });
  }
  res.cookie('auth', createAuthTokenForUsername(username));
  return res.json(sanitizeUser(user));
});

app.post('/logout', async (req, res) => {
  res.clearCookie('auth');
  return res.json({});
});

app.route('/player')
  .post(async (req, res) => {
    const { username = '', password = '' } = req.body;
    if (!username.trim()) {
      return res.status(400).json({ error: 'Username required' });
    }
    if (!password.trim()) {
      return res.status(400).json({ error: 'Password required' });
    }
    const user = await fetchPlayerByUsername(username);
    if (user) {
      return res.status(403).json({ error: 'Username taken' });
    }
    const passwordHash = hash(password);
    const player = await storePlayer(username, { username, passwordHash, joined: Date.now(), solutions: {} });
    res.cookie('auth', createAuthTokenForUsername(username));
    return res.json(sanitizeUser(player));
  })
  .get(authenticate, async (req, res) => res.json(sanitizeUser(await fetchPlayerByUsername(req.username))))
  .put(authenticate, async (req, res) => res.json(sanitizeUser(await updatePlayer(req.username, req.body))));

app.listen(PORT, () => console.log(`ColorCode is running on port ${PORT}`));

function authenticate (req, res, next) {
  const encryptedToken = req.cookies.auth;
  if (!encryptedToken) {
    return res.status(403).json({ error: 'Not logged in' });
  }
  try {
    const { username } = JSON.parse(decrypt(encryptedToken));
    req.username = username;
  } catch (err) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  return next();
}

function createAuthTokenForUsername (username) {
  return encrypt(JSON.stringify({ username, seed: uuidv4() }));
}

async function fetchPlayerByUsername (username) {
  try {
    return JSON.parse(await readFile(getPathToUserForUsername(username), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

async function storePlayer (username, user) {
  console.log(`${new Date()} - Creating player ${username}`);
  await writeFile(getPathToUserForUsername(username), JSON.stringify(user));
  return sanitizeUser(user);
}

async function updatePlayer (username, updatedPlayer) {
  console.log(`${new Date()} - Updating player ${username}`);
  const existingPlayer = await fetchPlayerByUsername(username);
  existingPlayer.solutions = updatedPlayer.solutions;
  await writeFile(getPathToUserForUsername(username), JSON.stringify(existingPlayer));
  return sanitizeUser(existingPlayer);
}

function sanitizeUser (user) {
  delete user.passwordHash;
  return user;
}

function getPathToUserForUsername (username) {
  return path.join(usersDir, `${username}.json`);
}

function hash (str) {
  return crypto.createHmac('sha256', ENCRYPTION_KEY).update(str).digest('hex');
}

function encrypt (str) {
  const cipher = crypto.createCipher('aes192', ENCRYPTION_KEY);
  return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt (encrypted) {
  const decipher = crypto.createDecipher('aes192', ENCRYPTION_KEY);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}