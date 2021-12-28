import { useMutation } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';
import { getFriends, removeFriend } from '../../../components/queries';

import style from './../network.module.css';

function FriendPreview(props) {

    //Queries and muattions
    const [RemoveFriend, { error }] = useMutation(removeFriend);

    //Methods
    const removeFriendQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        RemoveFriend({
            variables: {
                friendId: props.friend.id
            },
            refetchQueries: [{ query: getFriends }]
        });
    }

    //Render
    if (error) console.log(JSON.stringify(error, null, 2));
    return (
        <div className={style.FPreviewWrapper}>
            <Link to={"/profile/" + props.friend.id}>
                <img className={style.FPreviewPicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
            </Link>
            <div>
                <Link className={style.FPreviewName} to={"/profile/" + props.friend.id}>
                    <p className={` p `}>{props.friend.fname + " " + props.friend.lname}</p>
                </Link>
                <p className="p">{"Co-Founder & COO @ Favn Software"}</p>
            </div>
            <div>
                <input className="button grey" type={"submit"} value="Remove" onClick={e => { removeFriendQuery(e) }}></input>
            </div>
        </div>
    )
}

export default FriendPreview;