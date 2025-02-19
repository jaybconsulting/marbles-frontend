import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useAuth } from './useAuth';
import useRefresh from './useRefresh';

export default function useAxiosPrivate() {
    const { user } = useAuth();
    const refresh = useRefresh();
    
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${user.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error?.config;
                if (error.status === 401) {
                   const newAccessToken = await refresh();
                   originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                   return axiosPrivate(originalRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [user]);

    return axiosPrivate;
}