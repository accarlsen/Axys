import React, { useState, useContext } from 'react';
import { useSpring, animated as a } from 'react-spring';
import { Link, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { login } from './../components/queries';
import { AuthContext } from './../context/auth-context';
import './../style/login.css';
import './../style/common.css';
import './../style/root.css';

function Login() {

    const history = useHistory();
    const routeChange = () => {
        history.push("/")
    }

    const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginFunc, { loading, error, data }] = useLazyQuery(login);

    const context = useContext(AuthContext);

    //Methods
    const loginQuery = (e) => {
        e.preventDefault();
        loginFunc({
            variables: {
                email: email,
                password: password
            },
            options: {
                context: {
                    headers: {
                        "Authorization": context.token ? `Bearer $(context.token)` : ''
                    }
                }
            }
        })
        setEmail("");
        setPassword("");
    }

    //Key-inputs
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            loginQuery(event);
        }
    }

    if (loading) return <p>Loading ...</p>;
    if (data) {
        context.setToken(data.login.token);
        context.setPersonId(data.login.personId);
        context.setTokenExpiration(data.login.tokenExpiration);
        if (data.login.admin) {
            context.setAdmin(data.login.admin);
            localStorage.setItem('admin', data.login.admin);
        }
        else {
            context.setAdmin(false);
            localStorage.setItem('admin', null);
        }
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('personId', data.login.personId);

        routeChange();
    }

    return (
        <div className="login-wrapper" onKeyDown={handleKeyDown}>
            <a.div className="login-card card" style={props}>
                <h1 className="h2 login-title">Login</h1>
                <span></span>
                <input
                    onChange={e => {
                        setEmail(e.target.value);
                    }}
                    value={email}
                    id="login-input-email"
                    className="input"
                    type="email"
                    placeholder="email..."
                    autofocus="autofocus"
                    autoComplete="on"
                    maxlength="64" />
                <input onChange={e => {
                    setPassword(e.target.value);
                }}
                    value={password}
                    id="login-input-password"
                    className="input"
                    type="password"
                    placeholder="password..."
                    autoComplete="off"
                    maxlength="32"
                    minlength="8" />

                <div className="login-inline">
                    <input className="button grey" type="submit" value="Log in" onClick={e => { loginQuery(e) }}></input>
                    <Link className='a' to={"/signup"}><p className="p">{"Or sign up >"}</p></Link>
                </div>

            </a.div>
        </div>
    );
}

export default Login;