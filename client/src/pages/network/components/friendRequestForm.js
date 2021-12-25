import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { sendFriendRequest } from '../../../components/queries';

import style from './../network.module.css';

function FriendRequestForm() {

    //Variables
    const [email, setEmail] = useState("");

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

    if (error) console.log(JSON.stringify(error, null, 2));
    return (
        <div>
            <h1 className="h2">Add friends</h1>
            <div>
                <p className="p">Email: </p>
                <input className="input" type={"text"} placeholer={"email..."} value={email} onChange={(e) => setEmail(String(e.target.value))}></input>
                <input className="button grey" type={"submit"} value="Send" onClick={e => { sendFriendRequestQuery(e) }}></input>
            </div>
        </div>
    )
}

export default FriendRequestForm;