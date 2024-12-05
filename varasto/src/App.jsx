import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Logo from './assets/kuvat/logo.png'
import Etusivu from './components/Etusivu';
import Tuotteet from './components/Tuotteet';
import './App.css';
import Meista from './components/Meista';
import Register from './components/Register';
import AsiakasProfiili from './components/AsiakasProfiili';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (

    <Router>

      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary sticky-top custom-navbar" >
        <div className="container-fluid">
          <Link className="nav-link active" aria-current="page" to="/"><img className="navLogo" src={Logo} alt="" /></Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
           >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link text" to="/Tuotteet">Tuotteet</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text" to="/Meista">Meistä</Link>
              </li>
            </ul>


            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link text" to="/Register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/AsiakasProfiili"><span className="material-symbols-outlined user">account_circle</span></Link>

              </li>
            </ul>
          </div>
        </div>
      </nav>


      <Routes>
        <Route path="/k24TiimiNROFrontEnd/" element={<Etusivu />} />
        <Route path="tuotteet" element={<Tuotteet />} />
        <Route path="meista" element={<Meista />} />
        <Route path="register" element={<Register />} />
        <Route path="AsiakasProfiili" element={<AsiakasProfiili />} />
        <Route path="/" element={<Etusivu />} />
      </Routes>
      <footer className="footer">
      <p className='footer-text'>Omppu & Rane oy 2024</p>
      </footer>

    </Router>
  );
}

export default App;
