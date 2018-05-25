import fs from 'fs';
import path from 'path';
import util from 'util';
import express from 'express';

const app = express();

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const publicDir = path.join(__dirname, '../../public');

app.use(express.static(publicDir));

app.get('/edit/:puzzleId', (req, res) => res.sendFile('./index.html', { root: __dirname }));
app.get('/attempt/:puzzleId', (req, res) => res.sendFile('./index.html', { root: __dirname }));

app.get('/puzzle/:puzzleId', async (req, res) => {
  const puzzleId = req.params.puzzleId;
  const puzzle = await readFile()
});

// app.post('/puzzle')

app.listen(process.env.port || 1337);
