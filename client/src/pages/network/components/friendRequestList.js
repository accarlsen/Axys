import { useQuery } from '@apollo/client';
import React from 'react';
import { getFriendRequests } from '../../../components/queries';

import style from './../network.module.css';
import FriendRequestPreview from './friendRequestPreview';

function FriendRequestList() {

    //Queries and muattions
    const { loading, error, data } = useQuery(getFriendRequests)

    //Render
    if(error) console.log(JSON.stringify(error, null, 2));
    if(loading) return(<span>Loading...</span>)
    if(data) return (
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