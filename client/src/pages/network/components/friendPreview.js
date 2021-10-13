import { useMutation } from '@apollo/client';
import React from 'react';
import { answerFriendRequest } from '../../../components/queries';

import style from './../network.module.css';

function FriendPreview(props) {

    //Queries and muattions
    /*const [AnswerFriendRequest, { error }] = useMutation(answerFriendRequest)

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
    */
    return (
        <div className={style.FPreviewWrapper}>
            <img className={style.FPreviewPicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
            <div>
                <p className={` p ${style.FPreviewName}`}>{props.friend.fname + " " + props.friend.lname}</p>
                <p className="p">{"Co-Founder & COO @ Favn Software"}</p>
            </div>
            <div>
                <input className="button" type={"submit"} value="Accept" onClick={e => { }}></input>
            </div>
        </div>
    )
}

export default FriendPreview;