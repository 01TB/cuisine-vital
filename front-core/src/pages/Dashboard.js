import '../styles/custom.css';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';

const Dashboard = () => {
  const { user } = useUserAuth();
  const showSidebar = user?.roleId !== 3;

  return (
    <div className="app">
      <div className="app-content">
        {showSidebar && <Sidebar />}
        <main className="main-content" style={{ marginLeft: showSidebar ? '60px' : '0' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;