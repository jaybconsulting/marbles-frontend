import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RequireAuth() {
    const { user } = useAuth();

    return (
        user?.accessToken ? 
            <Outlet /> : 
            <Navigate to='/login' replace />
    );
}