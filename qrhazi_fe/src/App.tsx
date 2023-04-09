import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
