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

function App() {

  useEffect(() => {
    async function testFetch() {
      const res = await publicApi.post('/client/login', {
      email: 'faniry@gmail.com',
      motDePasse: '456'
    });
    
      const token = res.data.access_token;
      localStorage.setItem('token', token);
      console.log(localStorage.getItem('token'));

      // Ensuite, fais une requête GET protégée
      const res2 = await api.get('/client/auth');
      console.log('Réponse :', res2.data);
      }

      testFetch();

  }, []);

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
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;