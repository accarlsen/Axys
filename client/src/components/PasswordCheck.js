import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated as a } from 'react-spring';

function PasswordCheck(props) {

    const inputRef = useRef();
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [toOpacity1, setToOpacity1] = useState(0);
    const [toOpacity2, setToOpacity2] = useState(0);
    const [toColor, settoColor] = useState('#d13925');
    const [toWidth, setToWidth] = useState('0%');
    const [viewPassword, setViewPassword] = useState("password");

    //animation
    const animateCheckMark1 = useSpring({ to: { opacity: toOpacity1 }, from: { opacity: 0 } });
    const animateCheckMark2 = useSpring({ to: { opacity: toOpacity2 }, from: { opacity: 0 } });
    const animatePasswordStrength = useSpring({ to: { width: toWidth, backgroundColor: toColor }, from: { width: '0%', backgroundColor: "#d13925" } });

    //re-render whenever input is updated
    useEffect(
        () => {
        }, [inputRef]
    );

    return (
        <div className="input-signup-password-wrapper">
            <div className="input-signup-wrapper-password">
                <input
                    ref={inputRef}
                    onChange={e => {
                        const cValue = e.target.value; //current value1 - because state is async
                        let pValue = 0;
                        let colorValue = "#d13925"
                        setValue1(e.target.value);

                        if (cValue.length > 7) { setToOpacity1(1); pValue += 20; }
                        else if (cValue.length <= 7) { setToOpacity1(0); }

                        //Confirm password checkmark
                        if (value2 == cValue && cValue.length > 0) { setToOpacity2(1); }
                        else { setToOpacity2(0); }

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
                    value={value1}
                    id={props.id}
                    className="input-signup"
                    type={viewPassword}
                    placeholder={props.placeholder}
                    autoComplete={props.autoComplete}
                    maxLength={props.maxLength}
                    minLength={props.minLength} />

                <svg className="signup-eye" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid" width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                        if (viewPassword == "password") { setViewPassword("text"); }
                        else { setViewPassword("password") }
                    }}>
                    <mask id="a" fill="#fff"><path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" /></mask>
                    <path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" stroke="#000" stroke-width="40" mask="url(#a)" />
                    <circle cx="120" cy="120" r="50" stroke="#000" stroke-width="20" />
                </svg>

                <a.svg style={animateCheckMark1} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                </a.svg>
            </div>
            <a.div className="password-strength-bar" id={props.id + "password-strength"} style={animatePasswordStrength}></a.div>
            <div className="input-signup-wrapper-password input-signup-wrapper-confirm-margin">
                <input
                    ref={inputRef}
                    onChange={e => {
                        const cValue2 = e.target.value; //current value1 - because state is async
                        setValue2(e.target.value);
                        if (cValue2 == value1 && cValue2.length > 0) { setToOpacity2(1); }
                        else { setToOpacity2(0); }
                    }}
                    value={value2}
                    id={props.id}
                    className="input-signup"
                    type={viewPassword}
                    placeholder="confirm password..."
                    autoComplete={props.autoComplete}
                    maxLength={props.maxLength}
                    minLength={props.minLength} />

                <svg className="signup-eye" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid" width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                        if (viewPassword == "password") { setViewPassword("text"); }
                        else { setViewPassword("password") }
                    }}>
                    <mask id="a" fill="#fff"><path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" /></mask>
                    <path d="M234.757 84.9154c-7.515-24.5783-22.722-46.0947-43.383-61.3815C170.713 8.24706 145.69-.0023951 119.989 5.2e-7 94.2874.00239614 69.2658 8.25651 48.6078 23.5472 27.9497 38.8378 12.7466 60.3571 5.23688 84.9368L26.588 91.4602c6.1126-20.0068 18.4872-37.5225 35.302-49.9684 16.8147-12.4459 37.1811-19.1644 58.101-19.1663 20.92-.002 41.287 6.7127 58.104 19.1555 16.817 12.4427 29.195 29.9561 35.312 49.9618l21.35-6.5274z" stroke="#000" stroke-width="40" mask="url(#a)" />
                    <circle cx="120" cy="120" r="50" stroke="#000" stroke-width="20" />
                </svg>

                <a.svg style={animateCheckMark2} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                </a.svg>
            </div>
        </div>
    )
}

export default PasswordCheck;