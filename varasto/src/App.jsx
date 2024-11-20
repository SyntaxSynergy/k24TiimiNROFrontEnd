import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Etusivu from './components/Etusivu';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Etusivu</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Etusivu />} />
      </Routes>
    </Router>
  );
}

export default App;