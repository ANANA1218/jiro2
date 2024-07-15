// App.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TrelloBoard from './components/TrelloBoard'; // Import the TrelloBoard component
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <main>
        <Navbar />
        <TrelloBoard /> {/* Use the TrelloBoard component here */}
   
       </main>
       <footer>
        <Footer />
        </footer>
    </div>
  );
}

export default App;
