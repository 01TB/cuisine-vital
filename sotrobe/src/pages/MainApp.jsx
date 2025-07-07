import {Outlet} from 'react-router-dom';
import CursorFollower from "../components/CursorFollower";

const MainApp = () => {
    return (
        <>
            <main className='pt-5'>
                <Outlet/>
            </main>
        </>            
    );
};

export default MainApp;