import { useState } from 'react';
import { UserContext } from './UserContext';
import PropTypes from 'prop-types';

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const login = (user) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <UserContext.Provider 
            value={{ user, setUser, login, logout }}
        >
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};