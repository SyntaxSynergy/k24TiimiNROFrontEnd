import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Etusivu from './components/Etusivu';
import Tuotteet from './components/Tuotteet';
import './App.css';
import Meista from './components/Meista';
import Register from './components/Register';
import AsiakasProfiili from './components/AsiakasProfiili';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Etusivu</Link>
        <Link to="/Meista">Meistä</Link>
        <Link to="/Tuotteet">Tuotteet</Link>
        <Link to="/Register">Register</Link>
        <Link to="/AsiakasProfiili">Asiakasprofiili</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Etusivu />} />
        <Route path="tuotteet" element={<Tuotteet />} />
        <Route path="meista" element={<Meista />} />
        <Route path="register" element={<Register />} />
        <Route path="AsiakasProfiili" element={<AsiakasProfiili />} />
        <Route path="etusivu" element={<Etusivu />} />
      </Routes>
    </Router>
  );
}

export default App;