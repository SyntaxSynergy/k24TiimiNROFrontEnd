import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Etusivu from './components/Etusivu';
import Tuotteet from './components/Tuotteet';
import './App.css';
import Meista from './components/Meista';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Etusivu</Link>
        <Link to="/Meista">Meistä</Link>
        <Link to="/Tuotteet">Tuotteet</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Etusivu />} />
        <Route path="tuotteet" element={<Tuotteet />} />
        <Route path="meista" element={<Meista />} />
      </Routes>
    </Router>
  );
}

export default App;