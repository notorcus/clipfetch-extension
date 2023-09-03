// App.tsx
import './index.css';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <div className="main-container">
      <HomePage />
      {/* The area below the input field */}
      <div className="below-input-area">
        {/* Content goes here */}
      </div>
    </div>
  );
}

export default App;
