import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

export default function GoogleLogin() {
    let navigate = useNavigate();
    const { login } = useContext(UserContext);

    // TODO - why is the google button double loading?
    useEffect(() => {
        const gsiScript = document.createElement('script');
        gsiScript.src = 'https://accounts.google.com/gsi/client';
        gsiScript.async = true;
        document.body.appendChild(gsiScript);
    }, []); 

    window.handleCredentialResponse = (response) => {
        axios.post(`${import.meta.env.VITE_API_URL}/auth`, {
            credential: response.credential
        }, {
            withCredentials: true
        })
        .then(response => {
            console.log(response);  
            login(response.data);
            navigate('/dashboard');
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div
            style={{
                height: '44px',
                width: 'auto'
            }}
        >
            <div 
                id="g_id_onload"
                data-client_id="961613125900-0rsppejvif7ahrlfc8sgvfnoft580e2r.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleCredentialResponse"
                data-auto_prompt="false"
                data-auto_select="false"
            />
            <div 
                className="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="filled_blue"
                data-text="signin_with"
                data-size="large"
                data-locale="en"
                data-width="199"
                data-logo_alignment="left"
                style={{
                    colorScheme: 'light',
                }}
            />
        </div>
    );
}