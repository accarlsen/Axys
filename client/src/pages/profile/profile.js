import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { editProfile, getProfile, getProgress } from '../../components/queries';

import style from './profile.module.css';

function Profile() {

    let id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    const { loading, error, data } = useQuery(getProfile, {
        variables: { id: id }
    });

    const { loading: loadingP, error: errorP, data: dataP} = useQuery(getProgress)

    if (data && dataP) return (<ProfileRenderer profile={data} id={id} progress={dataP} />)
    return (<div></div>)
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

    //Log/Validity-states
    const [reqConf, setReqConf] = useState(false);

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
                curPassword: curPassword,
                newFName: fname,
                newLName: lname,
                newEmail: email,
                newPassword: passwordConf,
            },
            refetchQueries: [{ query: getProfile, variables: { id: id } }]
        });
        resetStates()
        setEdit(false)
        setConfirm(false)
        setEditPassword(false)
    }

    const resetStates = () => {
        setCurPassword("")
        setPassword("")
        setPasswordConf("")
        setFName(data.profile.fname)
        setLName(data.profile.lname)
        setEmail(data.profile.email)
    }

    const checkForChanges = () => {
        let changed = false;
        if (data.profile.fname !== fname) changed = true;
        if (data.profile.lname !== lname) changed = true;
        if (data.profile.email !== email) changed = true;
        if (password !== "") changed = true;

        if (editPassword) {
            if (password === passwordConf && passwordConf !== "") changed = true;
            else changed = false
        }

        return changed
    }

    if (error) console.log(error.message)

    //____________________
    //Render
    if (!edit) return ( //Profile-view
        <div className={style.wrapper}>
            <div className={style.cardWrapper}>
                <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />

                <div className={style.card}>
                    <h1 className={` h2 ${style.profileTitle}`}>{data.profile.fname + " " + data.profile.lname}</h1>
                    <p className="p">Location: Palm Springs, Toronto</p>
                    <p className="mt-2 p">Status: void</p>
                    {props.progress.progress.amntPlanned > 0 && <p className="mt-2 p">{"Daily goal: " + props.progress.progress.amntDone + "/" + props.progress.progress.amntPlanned}</p>}
                    <p className="p">{data.profile.email}</p>
                    <div className={style.buttonGrid}>
                        <Link className={style.linkWidth} to={"/customization"}>
                            <button className="button">
                                Customization
                            </button>
                        </Link>
                        {id === localStorage.getItem("personId") && <button className="button" onClick={() => setEdit(true)}>Edit Profile</button>}
                    </div>
                </div>
            </div>
        </div>
    )
    else if (edit && !confirm) { //Edit profile view
        return (
            <div className={style.wrapper}>
                <div className={style.cardWrapper}>
                    <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />

                    <div className={style.card}>
                        <div className={style.editWrapper}>
                            <div className={style.editFormGrid}>
                                <label className="p">First Name</label>
                                <input className="input" value={fname} onChange={e => { setFName(String(e.target.value)); }} ></input>
                            </div>
                            <div className={style.editFormGrid}>
                                <label className="p">Last Name</label>
                                <input className="input" onChange={e => { setLName(String(e.target.value)); }} value={lname}></input>
                            </div>
                            <div className={style.editFormGrid}>
                                <label className="p">Email</label>
                                <input className="input" onChange={e => { setEmail(String(e.target.value)); }} value={email}></input>
                            </div>
                            <div className={style.editFormGrid}>
                                <label className="p">Password</label>
                                {editPassword ?
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
                            <button className="button" onClick={() => { setEdit(false); setEditPassword(false); resetStates(); }}>Cancel</button>
                            <button className={checkForChanges() ? "button green" : "buttonInactive"} onClick={() => { if (checkForChanges()) setConfirm(true) }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (edit && confirm) { //Confirm password view
        return (
            <div className={style.wrapper}>
                <div className={style.cardWrapper}>
                    <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />

                    <div className={style.card}>
                        <div className={style.editWrapper}>
                            {fname !== data.profile.fname && <p className="p">{"Changed first name from " + data.profile.fname + " to " + fname + "."}</p>}
                            {lname !== data.profile.lname && <p className="p">{"Changed last name from " + data.profile.lname + " to " + lname + "."}</p>}
                            {email !== data.profile.email && <p className="p">{"Changed email from " + data.profile.email + " to " + email + "."}</p>}
                            {password !== data.profile.password && password !== "" && <p className="p">{"Changed password."}</p>}

                            <div className={style.editFormGrid}>
                                <label className="p">Current password:</label>
                                <input className="input" autoFocus={true} type="password" placeholder="New password" onChange={e => { setCurPassword(String(e.target.value)); }} value={curPassword}></input>
                            </div>
                        </div>

                        <div className={style.editSubmitGrid}>
                            <button className="button" onClick={() => { setConfirm(false); }}>Cancel</button>
                            <button className={curPassword.length > 0 ? "button green" : "buttonInactive"} onClick={(e) => { if (curPassword.length > 0) editProfileQuery(e); }}>Confirm Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;