import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { getProfile } from '../../components/queries';

import style from './profile.module.css';

function Profile() {

    let id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    //Queries
    const { loading, error, data } = useQuery(getProfile, {
        variables: { id: id }
    });

    if(data) return(
        <ProfileRenderer profile={data} id={id} />
    )

    return(
        <div></div>
    )
}

function ProfileRenderer(props) {
    const data = props.profile
    const id = props.id


    //Variables and states

    const [edit, setEdit] = useState(false);

    const [fname, setFName] = useState(data.profile.fname);
    const [lname, setLName] = useState(data.profile.lname);
    const [email, setEmail] = useState(data.profile.email);
    const [password, setPassword] = useState("");

    //Mutations

    //if(error){()=> history.pushState("/profile/" + id) }

    //Render
    if (data && !edit) return (
        <div className={style.wrapper}>
            <div className={style.cardWrapper}>
                <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                {id === localStorage.getItem("personId") && <button className={style.editButton} onClick={() => setEdit(true)}>E</button>}

                <div className={style.card}>
                    <h1 className={style.profileTitle}>{data.profile.fname + " " + data.profile.lname}</h1>
                    <p>Location: Palm Springs, Toronto</p>
                    <p className="mt-2">Status: Champagne Socialist</p>
                    <p className="mt-2">"A citizen gets eaten, unless an animal is beaten"</p>
                    <p>{data.profile.email}</p>
                </div>
            </div>
        </div>
    )

    if (data && edit) {
        return (
            <div className={style.wrapper}>
                <div className={style.cardWrapper}>
                    <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                    {id === localStorage.getItem("personId") && <button className={style.editButton} onClick={() => setEdit(true)}>E</button>}

                    <div className={style.card}>
                        <div className={style.editWrapper}>
                            <div className={style.editFormGrid}>
                                <label>First Name</label>
                                <input className="input" value={fname} onChange={e => { setFName(String(e.target.value)); }} ></input>
                            </div>
                            <div className={style.editFormGrid}>
                                <label>Last Name</label>
                                <input className="input" onChange={e => { setLName(String(e.target.value)); }} value={lname}></input>
                            </div>
                            <div className={style.editFormGrid}>
                                <label>Email</label>
                                <input className="input" onChange={e => { setEmail(String(e.target.value)); }} value={email}></input>
                            </div>
                            <div className={style.editFormGrid}>
                                <label>Password</label>
                                <input className="input" type="password" onChange={e => { setPassword(String(e.target.value)); }} value={password}></input>
                            </div>
                        </div>

                        <div className={style.editSubmitGrid}>
                            <button className="button" onClick={() => setEdit(false)}>Cancel</button>
                            <button className="button green">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div></div>
    )
}

export default Profile;