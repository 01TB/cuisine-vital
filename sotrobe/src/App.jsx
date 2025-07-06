import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MainApp from './pages/MainApp';
import './App.css';
import ClientProfile from './pages/ClientProfile';
import Menu from './pages/Menu';
import Login from './components/Login';
import { AuthProvider } from './providers/AuthProvider';
import { useEffect } from 'react';
import api from './const/api';
import publicApi from './const/publicApi';
import SignUp from './components/SignUp';

function App() {

  

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<MainApp/>}>
                <Route path='home' element={<LandingPage/>}></Route>
                <Route path='profile' element={<ClientProfile/>}></Route>
                <Route path='menus' element={<Menu/>}></Route>
                <Route path='profile' element={<ClientProfile/>}></Route>
            </Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;