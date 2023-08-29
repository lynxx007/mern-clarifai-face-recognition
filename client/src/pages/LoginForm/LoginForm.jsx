import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { AlertDemo } from '../../components/Alert/Alert';

const SignIn = () => {
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const navigate = useNavigate()
    const { loginUser, displayAlert, hideAlert, showAlert, isLogin, alertText } = useContext(AppContext)
    const onEmailChange = (event) => {
        setSignInEmail(event.target.value);
    };

    const onPasswordChange = (event) => {
        setSignInPassword(event.target.value);
    };

    const onSubmitSignIn = async (e) => {
        e.preventDefault()
        if (signInEmail === '' || signInPassword === '') {
            displayAlert()
            setTimeout(hideAlert, 3000)
            return
        }
        loginUser(signInEmail, signInPassword)

    };

    useEffect(() => {
        if (isLogin) {
            navigate('/')
        }
    }, [isLogin, navigate])

    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                {showAlert && <AlertDemo text={alertText} />}
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">
                                Email
                            </label>
                            <input
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="email"
                                name="email-address"
                                id="email-address"
                                onChange={onEmailChange}
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password"
                                name="password"
                                id="password"
                                onChange={onPasswordChange}
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            onClick={onSubmitSignIn}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value="Sign in"
                        />
                    </div>
                    <div className="lh-copy mt3">
                        <Link
                            to='/register'
                            className="f6 link dim black db pointer"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </main>
        </article>

    );
};

export default SignIn;
