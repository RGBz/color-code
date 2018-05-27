import fs from 'fs';
import path from 'path';
import util from 'util';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const publicDir = path.join(__dirname, '../../public');

app.use(express.static(publicDir));
app.use(bodyParser.json());

app.post('/puzzles', async (req, res) => {
  const puzzles = req.body;
  await writeFile(path.join(__dirname, '../client/puzzles.json'), JSON.stringify(puzzles, null, 2));
  res.json({ status: 'success' });
});

app.listen(process.env.port || 1337);
