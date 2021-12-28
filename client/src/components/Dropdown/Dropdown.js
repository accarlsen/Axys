import React from 'react';
import { animated, useSpring } from 'react-spring'
import style from './dropdown.module.css'

function Dropdown(props) {

    const rotate = useSpring({
        transform: props.state ? 'rotate(90deg)' : 'rotate(0deg)',
        config: {mass:1, tension:100, friction:1, clamp: true},
    })

    const onClick = () => {
        if(props.clickable) {
            props.state ? props.setState(false) : props.setState(true);
        }
    }

    return(
        <button className={style.dropdownButton} onClick={onClick()}>
            <animated.svg style={rotate} className={style.dropdownIcon} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <path className={style.dropdownIconFill} d="m0 0 256 128L0 256V0Z" fill="#0017E4" />
            </animated.svg>
        </button>
    )
}

export default Dropdown