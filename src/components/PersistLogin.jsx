import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import useRefresh from '../hooks/useRefresh';
import { useAuth } from '../hooks/useAuth';

export default function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const refresh = useRefresh();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !user?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [user, refresh]);

    return (
        <>
            {isLoading ? 
                <p>Loading...</p> : 
                <Outlet />
            }
        </>
    );
}