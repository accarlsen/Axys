import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSpring, animated as a } from 'react-spring';
import { gql, useQuery, useMutation } from '@apollo/client';
import InputCheck from './../components/InputCheck.js';
import PasswordCheck from './../components/PasswordCheck.js';
import { addPerson } from './../components/queries';
import './../style/signup.css';
import './../style/common.css';
import './../style/root.css';

function Signup() {

    const history = useHistory();
    const routeChange = () => {
        history.push("/login")
    }

    const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const hoverOn = useSpring({ backgroundColor: "#3AAFA9", to: { backgroundColor: "#289692" } });
    const hoverOff = useSpring({ backgroundColor: "#289692", to: { backgroundColor: "#3AAFA9" } });

    const inputRef1 = useRef();
    const [email, setValue1] = useState("");
    const [fromOpacity1, setFromOpacity1] = useState(0);
    const [toOpacity1, setToOpacity1] = useState(0);
    const animateCheckMark1 = useSpring({ to: { opacity: toOpacity1 }, from: { opacity: fromOpacity1 } });

    const inputRef2 = useRef();
    const [fname, setValue2] = useState("");
    const [fromOpacity2, setFromOpacity2] = useState(0);
    const [toOpacity2, setToOpacity2] = useState(0);
    const animateCheckMark2 = useSpring({ to: { opacity: toOpacity2 }, from: { opacity: fromOpacity2 } });

    const inputRef3 = useRef();
    const [lname, setValue3] = useState("");
    const [fromOpacity3, setFromOpacity3] = useState(0);
    const [toOpacity3, setToOpacity3] = useState(0);
    const animateCheckMark3 = useSpring({ to: { opacity: toOpacity3 }, from: { opacity: fromOpacity3 } });

    const inputRef4 = useRef();
    const [value4, setValue4] = useState("");
    const [fromOpacity4, setFromOpacity4] = useState(0);
    const [toOpacity4, setToOpacity4] = useState(0);
    const animateCheckMark4 = useSpring({ to: { opacity: toOpacity4 }, from: { opacity: fromOpacity4 } });

    const inputRef5 = useRef();
    const [password, setValue5] = useState("");
    const [fromOpacity5, setFromOpacity5] = useState(0);
    const [toOpacity5, setToOpacity5] = useState(0);
    const animateCheckMark5 = useSpring({ to: { opacity: toOpacity5 }, from: { opacity: fromOpacity5 } });

    const [toColor, settoColor] = useState('#d13925');
    const [toWidth, setToWidth] = useState('0%');
    const [viewPassword, setViewPassword] = useState("password");
    const animatePasswordStrength = useSpring({ to: { width: toWidth, backgroundColor: toColor }, from: { width: '0%', backgroundColor: "#d13925" } });

    const [update, setUpdate] = useState(false);

    const [AddPerson, { error }] = useMutation(addPerson, {
        variables: { fname, lname, email, password }
    })

    useEffect(
        () => {
        }, [update]
    );

    return (
        <div className="signup-wrapper">
            <a.div className="signup-card card" style={props}>
                <span className="title2">Create a new user</span>
                {/*<InputCheck id="signup-input-lname" type="lname" inputType="lname" placeholder="lname..."
                    autoComplete="on" maxLength="64" minLength="0" />
                <InputCheck id="signup-input-email" type="name" inputType="text" placeholder="first name..."
                    autoComplete="on" maxLength="64" minLength="0" />
                <InputCheck id="signup-input-fname" type="name" inputType="text" placeholder="last name..."
                    autoComplete="on" maxLength="64" minLength="0" />

                <PasswordCheck id="signup-input-npass" type="name" placeholder="new password..."
    autoComplete="off" maxLength="32" minLength="8" />*/}


                <div className="input-signup-wrapper">
                    <input
                        ref={inputRef1}
                        onChange={e => {
                            const cValue = e.target.value; //current email - because state is async
                            setValue1(e.target.value);
                            if (/\S+@\S+\.\S+/.test(cValue)) {
                                setToOpacity1(1);
                                setFromOpacity1(0);
                            }
                            else if (!/\S+@\S+\.\S+/.test(cValue)) {
                                setToOpacity1(0);
                                setFromOpacity1(1);
                            }
                        }}
                        value={email}
                        id={"signup-input-email"}
                        className="input-signup"
                        type={"email"}
                        placeholder={"email..."}
                        autoComplete={"on"}
                        maxLength={"64"}
                        minLength={"0"} />
                    <a.svg style={animateCheckMark1} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                    </a.svg>
                </div>

                <div className="input-signup-wrapper">
                    <input
                        ref={inputRef2}
                        onChange={e => {
                            const cValue = e.target.value; //current email - because state is async
                            setValue2(e.target.value);
                            if (/[A-Z]/i.test(cValue) && !/\d/.test(cValue) && cValue.length > 1) {
                                setToOpacity2(1);
                                setFromOpacity2(0);
                            }
                            else if (!/[A-Z]/i.test(cValue) || /\d/.test(cValue) || /[!@#\$%\^\&*\)\(+=._-]/.test(cValue) || cValue.length <= 1) {
                                setToOpacity2(0);
                                setFromOpacity2(1);
                            }
                        }}
                        value={fname}
                        id={"signup-input-fname"}
                        className="input-signup"
                        type={"text"}
                        placeholder={"first name..."}
                        autoComplete={"on"}
                        maxLength={"64"}
                        minLength={"0"} />
                    <a.svg style={animateCheckMark2} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                    </a.svg>
                </div>

                <div className="input-signup-wrapper">
                    <input
                        ref={inputRef3}
                        onChange={e => {
                            const cValue = e.target.value; //current email - because state is async
                            setValue3(e.target.value);
                            if (/[A-Z]/i.test(cValue) && !/\d/.test(cValue) && cValue.length > 1) {
                                setToOpacity3(1);
                                setFromOpacity3(0);
                            }
                            else if (!/[A-Z]/i.test(cValue) || /\d/.test(cValue) || /[!@#\$%\^\&*\)\(+=._-]/.test(cValue) || cValue.length <= 1) {
                                setToOpacity3(0);
                                setFromOpacity3(1);
                            }
                        }}
                        value={lname}
                        id={"signup-input-lname"}
                        className="input-signup"
                        type={"text"}
                        placeholder={"last name..."}
                        autoComplete={"on"}
                        maxLength={"64"}
                        minLength={"0"} />
                    <a.svg style={animateCheckMark3} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                    </a.svg>
                </div>


                <div className="input-signup-password-wrapper">
                    <div className="input-signup-wrapper-password">
                        <input
                            ref={inputRef4}
                            onChange={e => {
                                const cValue = e.target.value; //current email - because state is async
                                let pValue = 0;
                                let colorValue = "#d13925"
                                setValue4(e.target.value);

                                if (cValue.length > 7) { setToOpacity4(1); pValue += 20; }
                                else if (cValue.length <= 7) { setToOpacity4(0); }

                                //Confirm password checkmark
                                if (fname == cValue && cValue.length > 0) { setToOpacity5(1); }
                                else { setToOpacity5(0); }

                                if (/[a-z]/.test(cValue)) { pValue += 20; }
                                if (/[0-9]/.test(cValue)) { pValue += 20; }
                                if (/[A-Z]/.test(cValue)) { pValue += 20; }
                                if (/[!@#\$%\^\&*\)\(+=._-]/.test(cValue)) { pValue += 20; }

                                if (pValue > 20) { colorValue = "#d17225" }
                                if (pValue > 40) { colorValue = "#d1b725" }
                                if (pValue > 60) { colorValue = "#87d125" }
                                if (pValue > 80) { colorValue = "#25D195" }

                                const pValueFin = pValue.toString() + '%';
                                setToWidth(pValueFin);
                                settoColor(colorValue);
                            }}
                            value={value4}
                            id={"signup-input-npass"}
                            className="input-signup"
                            type={viewPassword}
                            placeholder={"new password..."}
                            autoComplete={"off"}
                            maxLength={"32"}
                            minLength={"8"} />

                        <svg className="signup-eye" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid" width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg"
                            onClick={() => {
                                if (viewPassword == "password") { setViewPassword("text"); }
                                else { setViewPassword("password") }
                            }}>
                            <mask id="a" fill="#fff"><path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" /></mask>
                            <path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" stroke="#000" stroke-width="40" mask="url(#a)" />
                            <circle cx="120" cy="120" r="50" stroke="#000" stroke-width="20" />
                        </svg>

                        <a.svg style={animateCheckMark4} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                        </a.svg>
                    </div>
                    <a.div className="password-strength-bar" id={props.id + "password-strength"} style={animatePasswordStrength}></a.div>

                    <div className="input-signup-wrapper-password input-signup-wrapper-confirm-margin">
                        <input
                            ref={inputRef5}
                            onChange={e => {
                                const cValue2 = e.target.value; //current email - because state is async
                                setValue5(e.target.value);
                                if (cValue2 == value4 && cValue2.length > 0) { setToOpacity5(1); }
                                else { setToOpacity5(0); }
                            }}
                            value={password}
                            id={"signup-input-npass"}
                            className="input-signup"
                            type={viewPassword}
                            placeholder="confirm password..."
                            autoComplete={"off"}
                            maxLength={"32"}
                            minLength={"0"} />

                        <svg className="signup-eye" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid" width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg"
                            onClick={() => {
                                if (viewPassword == "password") { setViewPassword("text"); }
                                else { setViewPassword("password") }
                            }}>
                            <mask id="a" fill="#fff"><path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" /></mask>
                            <path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" stroke="#000" stroke-width="40" mask="url(#a)" />
                            <circle cx="120" cy="120" r="50" stroke="#000" stroke-width="20" />
                        </svg>

                        <a.svg style={animateCheckMark5} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                        </a.svg>
                    </div>
                </div>

                <a.input className="button" type="submit" value="Create user" onClick={e => {
                    //if (toOpacity1 == 1 && toOpacity2 == 1 && toOpacity3 == 1 && toOpacity4 == 1 && toOpacity5 == 1) {
                    e.preventDefault();
                    AddPerson({
                        variables: {
                            fname: fname,
                            lname: lname,
                            email: email,
                            password: password
                        }
                    })
                    setValue1("");
                    setValue2("");
                    setValue3("");
                    setValue4("");
                    setValue5("");
                    setUpdate(true);
                    routeChange();
                }}></a.input>
            </a.div>
        </div>
    );
}

export default Signup;