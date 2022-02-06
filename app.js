const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const app = express();
app.use(cors());
app.use(bodyParser.json());

morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else return '';
});

app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'name required' });
  } else if (!req.body.number) {
    res.status(400).json({ error: 'number required' });
  } else {
    const exists = persons.find((person) => req.body.name === person.name);
    if (exists) {
      res.status(400).json({ error: 'name must be unique' });
    } else {
      const id = Math.floor(Math.random() * 100);
      req.body = {
        id,
        ...req.body,
      };
      persons.push(req.body);
      res.end();
    }
  }
});

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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server started on localhost:3001'));
