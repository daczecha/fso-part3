require('dotenv').config();

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const morgan = require('morgan');

const Number = require('./models/Number');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));

morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else return '';
});

app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/api/persons', (req, res) => {
  Number.find({}).then((result) => {
    res.json(result);
  });
});

app.post('/api/persons', (req, res) => {
  if (req.body.name === undefined || req.body.number === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const number = new Number({
    name: req.body.name,
    number: req.body.number,
  });

  number.save().then((savedNumber) => res.json(savedNumber));
});

/*

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else res.send('<p>person not found</p>');
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  res.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  res.write(`<p>${new Date()}</p>`);
  res.end();
});
*/
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server started on localhost:3001'));
