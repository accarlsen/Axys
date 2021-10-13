import { useMutation } from '@apollo/client';
import React from 'react';
import { answerFriendRequest, removeFriend } from '../../../components/queries';

import style from './../network.module.css';

function FriendPreview(props) {

    //Queries and muattions
    const [RemoveFriend, { error}] = useMutation(removeFriend);

    //Methods
    const removeFriendQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        RemoveFriend({
            variables: { 
                friendId: props.friend.id
            }
        });
    }

    if(error) console.log(JSON.stringify(error, null, 2));
    return (
        <div className={style.FPreviewWrapper}>
            <img className={style.FPreviewPicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
            <div>
                <p className={` p ${style.FPreviewName}`}>{props.friend.fname + " " + props.friend.lname}</p>
                <p className="p">{"Co-Founder & COO @ Favn Software"}</p>
            </div>
            <div>
                <input className="button" type={"submit"} value="Write" onClick={e => { }}></input>
                <input className="button" type={"submit"} value="Remove" onClick={e => { removeFriendQuery(e) }}></input>
            </div>
        </div>
    )
}

export default FriendPreview;