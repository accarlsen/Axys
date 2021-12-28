import React, { useState } from 'react';
import FriendRequestForm from './components/friendRequestForm';
import FriendRequestList from './components/friendRequestList';
import FriendsList from './components/friendsList';

import style from './network.module.css';

function Network() {

    //States
    const [FRList, setFRList] = useState(false)
    const [FRForm, setFRForm] = useState(false)

    //Render
    return (
        <div className={style.wrapper}>
            <div className={style.topBar}>
                <FriendRequestForm state={FRForm} setState={setFRForm} />

            </div>
            <div className={`${FRList ? style.centerGrid : style.center}`}>
                <div className={style.innerWrapper}>
                    <h1 className="h2">Friends</h1>
                    <FriendsList />
                </div>
                <FriendRequestList state={FRList} setState={setFRList} />
            </div>
        </div>
    )
}

export default Network;