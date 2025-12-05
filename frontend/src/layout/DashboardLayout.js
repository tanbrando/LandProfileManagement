import Sidebar from '../components/Sidebar';
import './Layout.css';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
}
