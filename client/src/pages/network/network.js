import React from 'react';
import FriendRequestForm from './components/friendRequestForm';
import FriendRequestList from './components/friendRequestList';
import FriendsList from './components/friendsList';

import style from './network.module.css';

function Network() {

    return (
        <div className={style.wrapper}>
            <div className={`${style.center}`}>
                <h1>Network</h1>
                <FriendsList />
            </div>
            <div className={style.rightWrapper}>
                <FriendRequestForm />
                <FriendRequestList />
            </div>
        </div>
    )
}

export default Network;