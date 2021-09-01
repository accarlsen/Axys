import React from 'react';
import FriendRequestForm from './components/friendRequestForm';

import style from './network.module.css';

function Network() {

    return(
        <div className={style.wrapper}>
            <FriendRequestForm />
        </div>
    )
}

export default Network;