import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Outlet, Navigate } from 'react-router-dom';

export default function RequireAuth() {
    const { user } = useContext(UserContext);

    return (
        user?.accessToken ? 
            <Outlet /> : 
            <Navigate to='/login' replace />
    );
}