import React, { useRef, useState, useEffect, useContext } from 'react';
import Login, { Render } from 'react-login-page';
import Logo from 'react-login-page/logo-rect';
import AuthContext from "../../context/AuthProvider";
import axios from '../../api/axios';
import './index.css';

const LOGIN_URL = '/auth';

const LoginFunc = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const pwdRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log('Response received:', response);
            console.log('Response data:', response.data);

            let token, iat, exp;
            try {
                token = response.data.token;
                iat = response.data.iat;
                exp = response.data.exp;
                console.log('Data extracted successfully');
            } catch (err) {
                console.error('Error extracting data:', err);
                throw err;
            }

            try {
                setAuth({ user, pwd, token, iat, exp });
                console.log('Auth set successfully');
            } catch (err) {
                console.error('Error setting auth:', err);
                throw err;
            }

            try {
                setUser('');
                console.log('User set successfully');
            } catch (err) {
                console.error('Error setting user:', err);
                throw err;
            }

            try {
                setPwd('');
                console.log('Password set successfully');
            } catch (err) {
                console.error('Error setting password:', err);
                throw err;
            }

            try {
                setSuccess(true);
                console.log('Success set successfully');
            } catch (err) {
                console.error('Error setting success:', err);
                throw err;
            }

        } catch (err) {
            if (err.response) {
                console.log('Error response:', err.response);
                console.log('Error response data:', err.response.data);
                console.log('Error response status:', err.response.status);

                if (err.response.status === 400) {
                    setErrMsg('Missing Username or Password');
                } else if (err.response.status === 401) {
                    setErrMsg('Unauthorized');
                } else {
                    setErrMsg('Login Failed');
                }
            } else if (err.request) {
                console.log('No response received:', err.request);
                setErrMsg('No Server Response');
            } else {
                console.log('Error setting up request:', err.message);
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        ref={userRef}
                        autoComplete="off"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        ref={pwdRef}
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <p>Need an Account?<br /><span className="line"><a href="/register">Sign Up</a></span></p>
        </section>
    );
};

export default LoginFunc;