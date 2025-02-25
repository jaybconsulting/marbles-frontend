import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function RequireAuth() {
    const { user } = useAuth();

    return (
        user?.accessToken ? 
            <Outlet /> : 
            <Navigate to='/login' replace />
    );
}