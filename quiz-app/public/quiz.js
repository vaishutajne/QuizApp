// public/quiz.js
let timerInterval;
let secondsRemaining = 0;



function stopTimer() {
  clearInterval(timerInterval);
}

async function fetchQuestions() {
  const response = await fetch('/questions');
  const questions = await response.json();
  displayQuestions(questions);
}

function displayQuestions(questions) {
  const quizDiv = document.getElementById('quiz');
  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
      <p>${index + 1}. ${question.question}</p>
      ${question.options.map(option => `
        <div>
          <input type="radio" id="option${index}-${option}" name="answer${index}" value="${option}">
          <label for="option${index}-${option}">${option}</label>
        </div>
      `).join('')}
    `;
    quizDiv.appendChild(questionElement);
  });
}

document.getElementById('start-quiz-btn').addEventListener('click', () => {
  const userName = prompt('Enter your name:');
  if (userName) {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('quiz-page').style.display = 'block';
    startTimer();
    fetchQuestions();
  }
});

document.getElementById('quiz-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  stopTimer();
  const formData = new FormData(this);
  const answers = [];
  formData.forEach((value) => {
    answers.push(value);
  });
  const response = await fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  });
  const result = await response.json();
  displayResult(result);
});
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    let html = '<h2>Result</h2>';
    html += `<p>Score: ${result.score} / ${result.feedback.length}</p>`;
    
    // Calculate percentage
    const percentage = (result.score / result.feedback.length) * 100;
    html += `<p>Percentage: ${percentage.toFixed(2)}%</p>`;
  
    html += '<h3>Feedback:</h3>';
    html += '<ul>';
    result.feedback.forEach(item => {
      html += `
        <li>
          <p>Question: ${item.question}</p>
          <p>Your Answer: ${item.userAnswer}</p>
          <p>Correct Answer: ${item.correctAnswer}</p>
          <p>${item.isCorrect ? 'Correct' : 'Incorrect'}</p>
        </li>
      `;
    });
    html += '</ul>';
    resultDiv.innerHTML = html;
  
    // Display a popup message if the score is below 50%
    if (percentage < 50) {
      alert('Your score is below 50%. Please try again.');
      // Redirect to the start page
      window.location.href = '/';
    }
  }
  // public/quiz.js
let timeLeft = 600; // 10 minutes in seconds
const timerElement = document.getElementById('timer');

function startTimer() {
  const timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      alert('Time is up! Your quiz has ended.');
      // Redirect to the start page
      window.location.href = '/';
    }
  }, 1000); // Update the timer every second
}

startTimer(); // Start the timer when the page loads

