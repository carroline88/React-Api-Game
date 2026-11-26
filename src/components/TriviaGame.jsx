import { useState, useEffect } from 'react';

function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(0);

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch trivia questions.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.response_code !== 0 || !data.results) {
          throw new Error('Too many requests. Please wait a few seconds and try again.');
        }

        const formattedQuestions = data.results.map((item) => {
          const allAnswers = [...item.incorrect_answers, item.correct_answer];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

          return {
            category: decodeHtml(item.category),
            difficulty: item.difficulty,
            question: decodeHtml(item.question),
            correctAnswer: decodeHtml(item.correct_answer),
            answers: shuffledAnswers.map((ans) => decodeHtml(ans)),
          };
        });

        setQuestions(formattedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsGameOver(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [round]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === questions[currentIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestartGame = () => {
    setRound((prevRound) => prevRound + 1);
  };

  if (loading) {
    return (
      <div className="game-card">
        <p className="status-text">Loading questions from API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-card">
        <p className="error-text">{error}</p>
        <button onClick={handleRestartGame} className="primary-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="game-card results-card">
        <h2>Quiz Complete!</h2>
        <p className="final-score">
          You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
        </p>
        <button onClick={handleRestartGame} className="primary-btn">
          Play Again (Fetch New Questions)
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="game-card">
      <div className="game-header">
        <span className="badge">{currentQuestion.category}</span>
        <span className="score-display">
          Question {currentIndex + 1}/{questions.length} | Score: {score}
        </span>
      </div>

      <h2 className="question-text">{currentQuestion.question}</h2>

      <div className="answers-grid">
        {currentQuestion.answers.map((answer, index) => {
          let buttonClass = 'answer-btn';
          if (selectedAnswer !== null) {
            if (answer === currentQuestion.correctAnswer) {
              buttonClass += ' correct';
            } else if (answer === selectedAnswer) {
              buttonClass += ' wrong';
            }
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswerClick(answer)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="feedback-section">
          <p className="feedback-text">
            {selectedAnswer === currentQuestion.correctAnswer
              ? 'Correct!'
              : `Wrong! The correct answer was: ${currentQuestion.correctAnswer}`}
          </p>
          <button onClick={handleNextQuestion} className="primary-btn">
            {currentIndex + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}

export default TriviaGame;