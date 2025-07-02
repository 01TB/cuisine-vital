import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MainApp from './pages/MainApp';
import './App.css';
import ClientProfile from './pages/ClientProfile';
import Menu from './pages/Menu';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<MainApp/>}>
              <Route path='home' element={<LandingPage/>}></Route>
              <Route path='profile' element={<ClientProfile/>}></Route>
              <Route path='menus' element={<Menu/>}></Route>
              <Route path='profile' element={<ClientProfile/>}></Route>
          </Route>
          <Route path='/login' element={<Login/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;