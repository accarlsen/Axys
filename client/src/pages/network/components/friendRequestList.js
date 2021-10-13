import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { getFriendRequests } from '../../../components/queries';

import style from './../network.module.css';
import FriendRequestPreview from './friendRequestPreview';

function FriendRequestList() {

    //Variables
    const [email, setEmail] = useState("");

    //Queries and muattions
    const { loading, error, data } = useQuery(getFriendRequests)
    if(error) console.log(JSON.stringify(error, null, 2));
    if(loading) return(<span>Loading...</span>)
    if(data && data.friendRequests.length > 0) return (
        <div className={style.FRListWrapper}>
            <h3>Friend requests: </h3>
            {data.friendRequests.map((friendReq) => (
                <FriendRequestPreview friendRequest={friendReq} />
            ))}
        </div>
    )
    return(
        <div></div>
    )
}

export default FriendRequestList;