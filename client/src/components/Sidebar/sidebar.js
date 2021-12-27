import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/client';
import style from './sidebar.module.css';
import { getProfile } from '../queries';

function Sidebar() {

    //Variables
    const [update, setUpdate] = useState(false);
    const [location, setLocation] = useState("/");
    const [collapsed, setCollapsed] = useState({
        profile: localStorage.getItem("collapsed.profile") ? true : false,
        pages: localStorage.getItem("collapsed.pages") ? true : false,
        projects: localStorage.getItem("collapsed.projects") ? true : false,
    })

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

    //DOM
    if (data) return (
        <div className={style.wrapper}>
            {collapsed.profile ?
                <div></div>
                :
                <div className={style.profileWrapper}>
                    <Link to={"/profile/" + userId}>Profile</Link>
                    {localStorage.getItem('token') && <li><a onClick={() => {
                        localStorage.setItem('admin', false);
                        localStorage.removeItem('token');
                        setUpdate(true);
                        routeChange();
                    }}>Log out</a></li>}
                </div>
            }
            <div>
                <div className={style.divider} onClick={() => { collapsed.pages ? setCollapsed({ pages: false }) : setCollapsed({ pages: true }) }}>
                    <button className={style.dropdownButton}>{collapsed.pages ? ">" : "^"}</button>
                    <p>{"Pages"}</p>
                </div>

                {collapsed.pages ?
                    <div />
                    :
                    <div className={style.list}>
                        <Link className={location === "/" ? style.linkSelected : style.link} to={"/"} onClick={() => setLocation("/")}>
                            <span># </span>
                            <span>Overview</span>
                        </Link>
                        <Link className={location === "/assignments" ? style.linkSelected : style.link} to={"/assignments"} onClick={() => setLocation("/assignments")}>
                            <span># </span>
                            <span>Assignments</span>
                        </Link>
                        <Link className={location === "/network" ? style.linkSelected : style.link} to={"/network"} onClick={() => setLocation("/network")}>
                            <span># </span>
                            <span>Network</span>
                        </Link>
                    </div>
                }
            </div>

            <div>
                <div className={style.divider} onClick={() => { collapsed.projects ? setCollapsed({ projects: false }) : setCollapsed({ projects: true }) }}>
                    <button className={style.dropdownButton}>{collapsed.projects ? ">" : "^"}</button>
                    <p>{"Projects"}</p>
                </div>
                {collapsed.projects ?
                    <div></div>
                    :
                    <div className={style.projects}>

                    </div>
                }
            </div>


        </div>
    )
    return <div></div>
}

export default Sidebar;