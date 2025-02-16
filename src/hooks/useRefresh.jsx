import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function useRefresh() {
    const { setUser } = useContext(UserContext);

    const refresh = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/refresh`, 
            { withCredentials: true }
        );
        setUser(response.data);
    }

    return refresh;
}