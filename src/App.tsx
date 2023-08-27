import './index.css';
import LinkInput from './components/LinkInput';

function App() {
  return (
    <div className="main-container">
      <LinkInput />
      {/* The area below the input field */}
      <div className="below-input-area">
        {/* Content goes here */}
      </div>
    </div>
  );
}

export default App;
