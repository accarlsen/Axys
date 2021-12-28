import { useQuery } from '@apollo/client';
import React from 'react';
import { getFriendRequests } from '../../../components/queries';

import style from './../network.module.css';
import FriendRequestPreview from './friendRequestPreview';

function FriendRequestList(props) {

    //Queries and muattions
    const { loading, error, data } = useQuery(getFriendRequests)

    //Render
    if (error) console.log(JSON.stringify(error, null, 2));
    if (loading) return (<span>Loading...</span>)

    if (data) {
        if (props.state === true) return (
            <div>
                <div className={style.FRListPreview}>
                    <button className="button grey" onClick={() => props.setState(false)}>
                        {data.friendRequests.length + " friend requests"}
                    </button>
                </div>
                <div className={style.FRListWrapper}>
                    <h3 className="h3">Friend requests: </h3>
                    <button className={style.exitButton} onClick={() => props.setState(false)}>X</button>
                    {data.friendRequests.map((friendReq) => (
                        <FriendRequestPreview friendRequest={friendReq} />
                    ))}
                </div>
            </div>
        )
        else return (
            <div className={style.FRListPreview}>
                <button className="button grey" onClick={() => props.setState(true)}>
                    {data.friendRequests.length + " friend requests"}
                </button>
            </div>
        )
    }
    return (
        <div></div>
    )
}

export default FriendRequestList;