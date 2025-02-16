import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Provider as ChakraProvider } from './components/ui/provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserProvider';
import MarblesGame from './MarblesGame';
import Layout from './components/Layout';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ChakraProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path='login' element={<Login />} />

                <Route element={<PersistLogin />}>
                  <Route element={<RequireAuth />}>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='game' element={<MarblesGame />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </ChakraProvider>
  </React.StrictMode>
);
