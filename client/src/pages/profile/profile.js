import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { editProfile, getProfile } from '../../components/queries';

import style from './profile.module.css';

function Profile() {

    let id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    const { loading, error, data } = useQuery(getProfile, {
        variables: { id: id }
    });

    if(data) return( <ProfileRenderer profile={data} id={id} /> )
    return( <div></div> )
}

function ProfileRenderer(props) {
    const data = props.profile
    const id = props.id

    //____________________
    //Variables and states

    //View-handlers
    const [edit, setEdit] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [confirm, setConfirm] = useState(false);

    //

    //Input-states
    const [fname, setFName] = useState(data.profile.fname);
    const [lname, setLName] = useState(data.profile.lname);
    const [email, setEmail] = useState(data.profile.email);
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [curPassword, setCurPassword] = useState("");

    //____________________
    //Mutations
    const [EditProfile, { error }] = useMutation(editProfile, {
        variables: { fname, lname, email, password }
    })

    //____________________
    //Methods
    const editProfileQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        EditProfile({
            variables: {
                curPassword: "Adonde",
                newFName: fname,
                newLName: lname,
                newEmail: email,
                newPassword: password,
            },
            refetchQueries: [{ query: getProfile, variables: { id: id }} ]
        });
        resetStates()
        setEdit(false)
    }

    const resetStates = () => {
        setCurPassword("")
        setPassword("")
        setPasswordConf("")
        setFName(data.profile.fname)
        setLName(data.profile.lname)
        setEmail(data.profile.email)
    }

    if(error) console.log(error.message)

    //____________________
    //Render
    if (!edit) return ( //Profile-view
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
    else if (edit && !confirm) { //Edit profile view
        return (
            <div className={style.wrapper}>
                <div className={style.cardWrapper}>
                    <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                    <button className={style.editButton} onClick={() => setEdit(true)}>X</button>

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
                                {editPassword? 
                                    <div>
                                        <input className="input" type="password" placeholder="New password" onChange={e => { setPassword(String(e.target.value)); }} value={password}></input>
                                        <input className="input mt-1" type="password" placeholder="Confirm password" onChange={e => { setPasswordConf(String(e.target.value)); }} value={passwordConf}></input>
                                    </div>
                                    :
                                    <button className="button" onClick={() => setEditPassword(true)}>Change password</button>
                                }
                            </div>
                        </div>

                        <div className={style.editSubmitGrid}>
                            <button className="button" onClick={() => { setEdit(false); resetStates();} }>Cancel</button>
                            <button className="button green" onClick={(e) => editProfileQuery(e)}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (edit && !confirm) { //Confirm password view
        return(
            <div className={style.wrapper}>
                <div className={style.cardWrapper}>
                    <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                    <button className={style.editButton} onClick={() => setEdit(true)}>X</button>

                    <div className={style.card}>
                        <div className={style.editWrapper}>
                            {fname === data.profile.fname && <p>{"Changed first name from " + data.profile.fname + " to " + fname + "."}</p>}
                            {lname === data.profile.lname && <p>{"Changed last name from " + data.profile.lname + " to " + lname + "."}</p>}
                            {email === data.profile.email && <p>{"Changed email from " + data.profile.email + " to " + email + "."}</p>}
                            {password === data.profile.password && <p>{"Changed password."}</p>}

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
                                {editPassword? 
                                    <div>
                                        <input className="input" type="password" placeholder="New password" onChange={e => { setPassword(String(e.target.value)); }} value={password}></input>
                                        <input className="input mt-1" type="password" placeholder="Confirm password" onChange={e => { setPasswordConf(String(e.target.value)); }} value={passwordConf}></input>

                                    </div>
                                    :
                                    <button className="button" onClick={() => setEditPassword(true)}>Change password</button>
                                }

                            </div>
                        </div>

                        <div className={style.editSubmitGrid}>
                            <button className="button" onClick={() => { setEdit(false); resetStates();} }>Cancel</button>
                            <button className="button green" onClick={(e) => editProfileQuery(e)}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;