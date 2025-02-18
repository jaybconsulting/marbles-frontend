import { Provider as ChakraProvider } from './components/ui/provider';
import { UserProvider } from './contexts/UserProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import Dashboard from './components/Dashboard';
import MarblesGame from './components/MarblesGame';

export default function App() {
  return (
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
  )
}