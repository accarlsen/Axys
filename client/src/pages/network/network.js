import React from 'react';
import FriendRequestForm from './components/friendRequestForm';
import FriendRequestList from './components/friendRequestList';

import style from './network.module.css';

function Network() {

    return (
        <div className={style.wrapper}>
            <div className={style.innerWrapper}>
                <h1>Network</h1>
                <FriendRequestForm />
                <FriendRequestList />
            </div>
        </div>
    )
}

export default Network;