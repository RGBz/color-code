import fs from 'fs';
import path from 'path';
import util from 'util';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const publicDir = path.join(__dirname, '../../public');
const puzzlePackPath = path.join(__dirname, '../client/puzzle-packs.json');

app.use(express.static(publicDir));
app.use(bodyParser.json());

app.post('/puzzle-packs', async (req, res) => {
  const puzzlePacks = req.body;
  await writeFile(puzzlePackPath, JSON.stringify(puzzlePacks, null, 2));
  res.json({ status: 'success' });
});

app.listen(process.env.port || 1337);
