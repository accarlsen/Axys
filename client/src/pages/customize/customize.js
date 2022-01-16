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

    if (data) return (<CustomizationRenderer profile={data} id={id} applyTheme={props.applyTheme} />)
    return (<div></div>)
}

function CustomizationRenderer(props) {
    const data = props.profile
    const id = props.id

    const themes = [
        { name: "dark", backgroundColor: "#1b1b1b", background2Color: "#222", textColor: "#FFF", shadowColor: "#b8b8b800" },
        { name: "light", backgroundColor: "#f9f9f9", background2Color: "#FFF", textColor: "#000", shadowColor: "#b8b8b8" },
        { name: "advent", backgroundColor: "rgb(15, 15, 30)", background2Color: "rgb(15, 15, 30)", textColor: "rgb(5, 197, 0)", shadowColor: "#b8b8b800" },
        { name: "material", backgroundColor: "#121212", background2Color: "#222831", textColor: "#e0e0e0", shadowColor: "#b8b8b800" },
        { name: "beluga", backgroundColor: "#0a0e10", background2Color: "#202c33", textColor: "#e0e0e0", shadowColor: "#b8b8b800" },


    ]

    //Render
    return (
        <div className={style.wrapper}>
            <div className={style.cardWrapper}>

                <div className={style.card}>
                    <div className={style.editWrapper}>
                        {themes.map((theme) => (
                            <button className={style.previewButton} onClick={()=>props.applyTheme(theme.name)}>
                                <svg className={style.preview} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                    <path fill="#fff" d="M0 0h256v256H0z" />
                                    <path fill={theme.backgroundColor} d="M0 0h256v256H0z" />
                                    <path fill={theme.background2Color} d="M0 0h126v205H0z" />
                                    <path fill={theme.textColor} d="M0 198h256v58H0z" />
                                    <path fill={theme.shadowColor} d="M215 198h41v58h-41z" />
                                </svg>
                                <p className="p">{theme.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customize;