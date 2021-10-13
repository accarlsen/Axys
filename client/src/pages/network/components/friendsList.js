import { useQuery } from '@apollo/client';
import React from 'react';
import { getFriends } from '../../../components/queries';

import style from './../network.module.css';

function FriendsList() {

    //Queries and mutations
    const { loading, error, data } = useQuery(getFriends)

    //Render
    if(error) console.log(JSON.stringify(error, null, 2));
    if(loading) return(<span>Loading...</span>)
    if(data && data.friends.length > 0) return (
        <div className={style.FRListWrapper}>
            {console.log(data.friends)}
            <h3>Friends: </h3>
            {data.friends.map((friend) => (
                <span>{friend.fname  + " " + friend.lname}</span>
            ))}
        </div>
    )
    else if (data) return(
        <div>
            {console.log("no friends")}
            <h3>Friends: </h3>
            <p className="p">{"Add friends to get started ->"}</p>
        </div>
    )
    return(
        <div><h3>Friends: </h3></div>
    )
}

export default FriendsList;