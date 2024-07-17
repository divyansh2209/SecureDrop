import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SecretPage from './pages/SecretPage';
import Notfound from './pages/Notfound';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/secret/:id" element={<SecretPage />} />
          <Route path="/notfound" element={<Notfound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
