import {Outlet} from 'react-router-dom';
import CursorFollower from "../components/CursorFollower";
import AppNavbar from "../components/Navbar";
import { AuthProvider } from '../providers/AuthProvider';

const MainApp = () => {
    return (
        <>
            <main className='pt-5'>
                <CursorFollower/>
                <AppNavbar />
                <Outlet/>
            </main>
        </>            
    );
};

export default MainApp;