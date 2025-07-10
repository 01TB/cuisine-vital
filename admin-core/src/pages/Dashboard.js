import '../styles/custom.css';
import Sidebar from '../components/Sidebar';
import {Outlet} from 'react-router-dom'

const App = () => {
  return (
    <div className="app">
      <div className="app-content">
        <Sidebar/>
        <main className="main-content">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default App;