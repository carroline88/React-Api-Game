import './App.css';
import TriviaGame from './components/TriviaGame';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>API Trivia Challenge</h1>
        <p>Test your knowledge with live questions fetched from the Open Trivia API</p>
      </header>

      <main>
        <TriviaGame />
      </main>
    </div>
  );
}

export default App;
