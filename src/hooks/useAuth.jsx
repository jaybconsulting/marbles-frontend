import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export const useAuth = () => {
    const { user, setUser, login, logout } = useContext(UserContext);

    return { user, setUser, login, logout };
};