// app.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.post('/submit', (req, res) => {
  const userAnswers = req.body.answers;
  if (!Array.isArray(userAnswers) || userAnswers.length !== questions.length) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  let score = 0;
  const feedback = questions.map((question, index) => {
    const isCorrect = question.answer === userAnswers[index];
    if (isCorrect) {
      score++;
    }
    return {
      question: question.question,
      correctAnswer: question.answer,
      userAnswer: userAnswers[index],
      isCorrect
    };
  });
  res.json({ score, feedback });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

