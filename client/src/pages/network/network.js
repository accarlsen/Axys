import React from 'react';
import FriendRequestForm from './components/friendRequestForm';
import FriendRequestList from './components/friendRequestList';

import style from './network.module.css';

function Network() {

    return(
        <div className={style.wrapper}>
            <FriendRequestForm />
            <FriendRequestList />
        </div>
    )
}

export default Network;