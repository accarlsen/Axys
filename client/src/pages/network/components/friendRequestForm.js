import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { sendFriendRequest } from '../../../components/queries';

import style from './../network.module.css';

function FriendRequestForm(props) {

    //Variables
    const [email, setEmail] = useState('');

    //Queries and muattions
    const [SendFriendRequest, { error }] = useMutation(sendFriendRequest, {
        variables: { email: email }
    })

    //Methods
    const sendFriendRequestQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        SendFriendRequest({
            variables: { email: email }
        });
        setEmail("");
    }

    const cancel = () => {
        setEmail("")
        props.setState(false)
    }

    const validateEmail = (email) => {
        if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum|no|co|se|dk|fi|is|be)\b/.test(email)) return true
        return false
    }

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (props.state && event.key === 'Enter' && (String(email.replace(/\s/g, '')).length >= 1)) {
            sendFriendRequestQuery(event);
        }
        else if (props.state && event.key === 'Escape') {
            cancel();
        }
    }

    if (error) console.log(JSON.stringify(error, null, 2));

    console.log(props.state)
    if (props.state === true) return (
        <div className={style.FRFormWrapper} onKeyDown={handleKeyDown}>
            <input className="inputNoBorder" autoFocus={true} type={"text"} placeholder={"email..."} value={email} onChange={(e) => setEmail(String(e.target.value))}></input>
            <button className="button grey" onClick={() => cancel()}>Cancel</button>
            <input className={`button ${validateEmail(email) ? "green" : "grey"}`} type={"submit"} value="Send" onClick={e => { if(validateEmail(email)) sendFriendRequestQuery(e) }}></input>
        </div>
    )
    else return (
        <button className={`button grey ${style.FRFormPreview}`} onClick={() => props.setState(true)}>Add friends</button>
    )
}

export default FriendRequestForm;