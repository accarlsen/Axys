import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/client';
import style from './sidebar.module.css';
import { getProfile } from '../queries';
import Dropdown from '../Dropdown/Dropdown';

function Sidebar() {

    //Variables
    const [update, setUpdate] = useState(false);
    const [location, setLocation] = useState("/");

    const [cProfile, setCProfile] = useState(localStorage.getItem("collapsed.profile") === true ? true : false)
    const [cPages, setCPages] = useState(localStorage.getItem("collapsed.pages") === true ? true : false)
    const [cProjects, setCProjects] = useState(localStorage.getItem("collapsed.projects") === true ? true : false)

    const history = useHistory();
    const userId = localStorage.getItem("personId");

    //Query
    const { loading, error, data } = useQuery(getProfile, {
        variables: { id: userId }
    });

    //Methods
    useEffect(
        () => {
        }, [update]
    );


    const routeChange = () => {
        history.push("/login")
    }

    const logOut = () => {
        localStorage.setItem('admin', false);
        localStorage.removeItem('token');
        setUpdate(true);
        routeChange();
    }

    //DOM
    if (data) return (
        <div className={style.wrapper}>

            <div className={style.profileWrapper}>
                <Link className={style.profileName} to={"/profile/" + userId}>
                    {data.profile.name}
                </Link>
                {cProfile ?
                    <div></div>
                    :
                    <div className={style.link}>
                        <span>{">"}</span>
                        <a onClick={() => logOut()}>Log out</a>
                    </div>
                }
            </div>

            <div>
                <div className={style.divider} onClick={() => { cPages ? setCPages(false) : setCPages(true) }}>
                    <Dropdown state={cPages} setState={setCPages} clickable={false} />
                    <p>{"Pages"}</p>
                </div>

                {cPages ?
                    <div />
                    :
                    <div className={style.list}>
                        <Link className={location === "/" ? style.linkSelected : style.link} to={"/"} onClick={() => setLocation("/")}>
                            <span>#</span>
                            <span>Overview</span>
                        </Link>
                        <Link className={location === "/assignments" ? style.linkSelected : style.link} to={"/assignments"} onClick={() => setLocation("/assignments")}>
                            <span>#</span>
                            <span>Assignments</span>
                        </Link>
                        <Link className={location === "/network" ? style.linkSelected : style.link} to={"/network"} onClick={() => setLocation("/network")}>
                            <span>#</span>
                            <span>Network</span>
                        </Link>
                    </div>
                }
            </div>

            <div>
                <div className={style.divider} onClick={() => { cProjects ? setCProjects(false) : setCProjects(true) }}>
                    <Dropdown state={cProjects} setState={setCProjects} clickable={false} />
                    <p>{"Projects"}</p>
                </div>
                {cProjects ?
                    <div></div>
                    :
                    <div className={style.projects}>
                        <Link className={location === "/create-project" ? style.linkSelected : style.link} to={"/create-project"} onClick={() => setLocation("/create-project")}>
                            <span>+</span>
                            <span>Create Project</span>
                        </Link>
                    </div>
                }
            </div>


        </div>
    )
    return <div></div>
}

export default Sidebar;