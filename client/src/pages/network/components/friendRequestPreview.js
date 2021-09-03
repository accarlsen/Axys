import { useMutation } from '@apollo/client';
import React from 'react';
import { answerFriendRequest } from '../../../components/queries';

import style from './../network.module.css';

function FriendRequestPreview(props) {

    //Queries and muattions
    const [AnswerFriendRequest, { error }] = useMutation(answerFriendRequest)

    //Methods
    const answerFriendRequestQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        AnswerFriendRequest({
            variables: { 
                id: props.friendRequest.id,
                answer: true,
                senderId: props.friendRequest.senderId
            }
        });
    }

    if(error) console.log(JSON.stringify(error, null, 2));
    return (
        <div className={style.FRPreviewWrapper}>
            <p>{props.friendRequest.sender.fname + " " + props.friendRequest.sender.lname + " sent you a friend-request."}</p>
            <input type={"submit"} value="Accept" onClick={e => { answerFriendRequestQuery(e) }}></input>
        </div>
    )
}

export default FriendRequestPreview;