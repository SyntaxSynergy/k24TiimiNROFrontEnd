import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Etusivu from './components/Etusivu';
import Tuotteet from './components/Tuotteet';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Etusivu</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Etusivu />} />
        <Route path="tuotteet" element={<Tuotteet />} />
      </Routes>
    </Router>
  );
}

export default App;