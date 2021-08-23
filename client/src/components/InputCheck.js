import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated as a } from 'react-spring';

function InputCheck(props) {

    const inputRef1 = useRef();
    const [value1, setValue1] = useState("");
    const [fromOpacity1, setFromOpacity1] = useState(0);
    const [toOpacity1, setToOpacity1] = useState(0);

    //animation
    const animateCheckMark1 = useSpring({ to: { opacity: toOpacity1 }, from: { opacity: fromOpacity1 } });

    //default values
    if(!props.autoComplete){props.autoComplete="on"}
    if(!props.maxLength){props.maxLength="64"}
    if(props.minLength==null){props.minLength="0"}
    
    //re-render whenever input is updated
    useEffect(
        () => {
        }, [inputRef1]
    );

    return (
        <div className="input-signup-wrapper">
            <input
                ref={inputRef1}
                onChange={e => {
                    const cValue = e.target.value1; //current value1 - because state is async
                    setValue1(e.target.value1);
                    if(props.type == "email"){ //confirm input is a email
                        if (/\S+@\S+\.\S+/.test(cValue)) {
                            setToOpacity1(1);
                            setFromOpacity1(0);
                        }
                        else if (!/\S+@\S+\.\S+/.test(cValue)) {
                            setToOpacity1(0);
                            setFromOpacity1(1);
                        }
                    }
                    else if(props.type == "name"){ //confirm input is a name
                        if (/[A-Z]/i.test(cValue) && !/\d/.test(cValue) && cValue.length > 1) {
                            setToOpacity1(1);
                            setFromOpacity1(0);
                        }
                        else if (!/[A-Z]/i.test(cValue) || /\d/.test(cValue) || /[!@#\$%\^\&*\)\(+=._-]/.test(cValue) || cValue.length <= 1) {
                            setToOpacity1(0);
                            setFromOpacity1(1);
                        }
                    }
                    else{
                        if (/\d/.test(cValue)) {
                            setToOpacity1(1);
                            setFromOpacity1(0);
                        }
                        else if (!/\d/.test(cValue)) {
                            setToOpacity1(0);
                            setFromOpacity1(1);
                        }
                    }
                }}
                value1={value1}
                id={props.id}
                className="input-signup"
                type={props.inputType}
                placeholder={props.placeholder}
                autoComplete={props.autoComplete}
                maxLength={props.maxLength}
                minLength={props.minLength} />
            <a.svg style={animateCheckMark1} className="signup-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke="#25D195" strokeWidth="30" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
            </a.svg>
        </div>
    )
}

export default InputCheck;