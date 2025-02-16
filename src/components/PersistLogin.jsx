import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Outlet } from 'react-router-dom';
import useRefresh from '../hooks/useRefresh';

export default function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
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