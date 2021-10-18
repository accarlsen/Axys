import { useQuery } from '@apollo/client';
import React from 'react';
import { getProfile } from '../../components/queries';

import style from './profile.module.css';

function Profile() {

    //Queries
    const {loading, error, data} = useQuery(getProfile)

    //Render
    if(data) return (
        <div className={style.wrapper}>
            <div className={style.cardWrapper}>
                <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />

                <div className={style.card}>
                    <h1 className={style.profileTitle}>{data.profile.fname + " " + data.profile.lname}</h1>
                    <p>Location: Palm Springs, Toronto</p>
                    <p className="mt-2">Status: Champagne Socialist</p>
                    <p className="mt-2">"A citizen gets eaten, unless an animal is beaten"</p>
                </div>
            </div>
        </div>
    )

    return (
        <div></div>
    )
}

export default Profile;