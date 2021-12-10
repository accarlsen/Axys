import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { editProfile, getProfile, getProgress } from '../../components/queries';

import style from './customize.module.css';

function Customize(props) {
    const id = localStorage.getItem("personId")

    const { loading, error, data } = useQuery(getProfile, {
        variables: { id: id }
    });

    if (data) return (<CustomizationRenderer profile={data} id={id} toggleTheme={props.toggleTheme} />)
    return (<div></div>)
}

function CustomizationRenderer(props) {
    const data = props.profile
    const id = props.id

    //Render
    return (
        <div className={style.wrapper}>
            <div className={style.cardWrapper}>

                <div className={style.card}>
                    <div className={style.editWrapper}>
                        <div className={style.editFormGrid}>
                            <label className="p">First Name</label>
                            <input className="input" ></input>
                        </div>
                        <button className="button" onClick={()=> props.toggleTheme()}>Toggle theme</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customize;