import {Outlet} from 'react-router-dom';
import CursorFollower from "../components/CursorFollower";
import AppNavbar from "../components/Navbar";
import { AuthProvider } from '../providers/AuthProvider';

const MainApp = () => {
    return (
        <AuthProvider>
            <main className='pt-5'>
                <CursorFollower/>
                <AppNavbar />
                <Outlet/>
            </main>
        </AuthProvider>            
    );
};

export default MainApp;