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

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else return '';
});

app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/api/persons', (req, res, next) => {
  Number.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  if (req.body.name === undefined || req.body.number === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const number = new Number({
    name: req.body.name,
    number: req.body.number,
  });

  number
    .save()
    .then((savedNumber) => res.json(savedNumber))
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Number.findById(id)
    .then((result) => {
      if (result) res.json(result);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Number.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  const number = {
    name: req.body.name,
    number: req.body.number,
  };

  Number.findByIdAndUpdate(id, number, { new: true, runValidators: true })
    .then((updatedNumber) => res.json(updatedNumber))
    .catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
  Number.countDocuments({}, function (err, count) {
    console.log(count);
    res.write(`<p>Phonebook has info for ${count} people</p>`);
    res.write(`<p>${new Date()}</p>`);
    res.end();
  }).catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server started on localhost:3001'));
