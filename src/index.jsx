import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import { Provider as ChakraProvider } from './components/ui/Provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserProvider';
import MarblesGame from './MarblesGame';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ChakraProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/game' element={<MarblesGame />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </ChakraProvider>
  </React.StrictMode>
);
