import axios from '../api/axios';
import { useAuth } from './useAuth';

export default function useRefresh() {
    const { setUser } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', 
            { withCredentials: true }
        );
        setUser(response.data);
        return response.data.accessToken;
    }

    return refresh;
}