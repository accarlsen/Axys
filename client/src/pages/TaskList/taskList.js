import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSpring, animated as a } from 'react-spring';
import { Link, useHistory } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../../context/auth-context';
import { addTask, getTasks } from '../../components/queries';
import CreateTask from './components/CreateTask';

import style from './taskList.module.css'
import Task from './components/task';
import SearchTask from './components/SearchTask';


function TaskList() {

    const [taskActive, setTaskActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [activationLetter, setActivationLetter] = useState("");
    const [activationNumber, setActivationNumber] = useState("");

    const { loading, error, data } = useQuery(getTasks,
        {
            variables: { authorId: localStorage.getItem("personId") }
        });


    useEffect(() => {
        const handleDown = (event) => {

            if (event.keyCode >= 48 && event.keyCode <= 57) {
                //Number
                if (!searchActive && !taskActive) {
                    setActivationNumber(String.fromCharCode(event.keyCode));
                    setSearchActive(true);
                }
            }
            else if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
                //Higher and lower case letter
                if (!taskActive && !searchActive) {
                    setActivationLetter(String.fromCharCode(event.keyCode));
                    setTaskActive(true);
                }
            }
            else if (event.key === 'Enter' || event.key === 'Escape') {
                setTaskActive(false);
                setActivationLetter("");
                setSearchActive(false);
                setActivationNumber("");
            }
        }

        const handleUp = (event) => {
        }

        window.addEventListener("keyup", handleUp)
        window.addEventListener("keydown", handleDown)

        return () => {
            window.removeEventListener("keyup", handleUp)
            window.removeEventListener("keydown", handleDown)
        }
    })


    if (loading) return <span>Loading...</span>
    if (error) return <span>{error.message}</span>

    if (data) return (
        <div className={style.wrapper}>
            <div className={style.taskListWrapper}>
                {data.tasks.map((task, i) => (
                    <Task task={task} index={i + 1} />
                ))}
            </div>
            <div>
                <CreateTask active={taskActive} activationLetter={activationLetter} />
            </div>
            <SearchTask active={searchActive} activationNumber={activationNumber} tasks={data.tasks} />
        </div>
    )

    return <div></div>
}

export default TaskList;