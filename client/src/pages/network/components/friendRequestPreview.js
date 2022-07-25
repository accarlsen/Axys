import { useMutation } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';
import { answerFriendRequest, getFriendRequests } from '../../../components/queries';

import style from './../network.module.css';

function FriendRequestPreview(props) {

    //Queries and mutations
    const [AnswerFriendRequest, { error }] = useMutation(answerFriendRequest)

    //Methods
    const answerFriendRequestQuery = (event, answer) => {
        event.preventDefault(); //Enable custom behaviour
        AnswerFriendRequest({
            variables: {
                id: props.friendRequest.id,
                answer: answer,
                senderId: props.friendRequest.senderId
            },
            refetchQueries: [{ query: getFriendRequests }]
        });
    }

    //Render
    if (error) console.log(JSON.stringify(error, null, 2));
    return (
        <div className={style.FRPreviewWrapper}>
            <div className={style.FRPreviewTopGrid}>
                <img className={style.FRPreviewPicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                <Link className={style.FPreviewName} to={"/profile/" + props.friendRequest.senderId}>
                    <p>{props.friendRequest.sender.fname + " " + props.friendRequest.sender.lname}</p>
                </Link>
            </div>
            <div className={style.FRPreviewBottomGrid}>
                <input className="button-small grey" type={"submit"} value="Accept" onClick={e => { answerFriendRequestQuery(e, true) }}></input>
                <input className="button-small grey" type={"submit"} value="Ignore" onClick={e => { answerFriendRequestQuery(e, false) }}></input>
            </div>
        </div>
    )
}

export default FriendRequestPreview;