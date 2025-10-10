import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './componentes/Navbar/Navbar';
import Footer from './componentes/Footer/Footer';

import Landing from './paginas/Landing';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

