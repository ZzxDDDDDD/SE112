import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const isMountedRef = useRef(true);

    useEffect(() => {
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/profile', {
                    signal: controller.signal
                });
                console.log(response.data);
                const userData = response.data.data ? [response.data.data] : [];
                isMountedRef.current && setUsers(userData);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMountedRef.current = false;
            controller.abort();
        }
    }, [])

    return (
        <article>
            {users.length > 0 ? (
                <ul>
                    {users.map((user, i) => (
                        <li key={i}>
                            <p>Email: {user.email}</p>
                            <p>Vaccination Status: {user.first_name === 'injected' ? '✓' : user.first_name === 'notinject' ? '✗' : 'N/A'}</p>
                            <p>Full Name: {user.last_name || 'N/A'}</p>
                            <p>Vaccinated On: {new Date(user.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
        </article>
    );
};

export default Users;
