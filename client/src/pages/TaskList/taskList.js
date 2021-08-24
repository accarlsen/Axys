import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSpring, animated as a } from 'react-spring';
import { Link, useHistory } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../../context/auth-context';
import { addTask, getTasks } from '../../components/queries';
import CreateTask from './components/CreateTask';

import style from './taskList.module.css'
import Task from './components/task';


function TaskList() {
    const context = useContext(AuthContext);

    const [name, setName] = useState("");
    const [newTask, setNewTask] = useState(false);
    const [activationLetter, setActivationLetter] = useState("");

    const [AddTask, { errorAT }] = useMutation(addTask, {
        variables: { name }
    });

    const { loading, error, data } = useQuery(getTasks,
        {
            variables: { authorId: localStorage.getItem("personId") }
        });


    useEffect(() => {
        const handleDown = (event) => {
            if (event.keyCode >= 48 && event.keyCode <= 57) {
                //Number
                console.log("Number");
                
            }
            else if ( (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) ){
                //Higher and lower case letter
                console.log("Letter");
                if (!newTask) {
                    setNewTask(true);
                    setActivationLetter(String.fromCharCode(event.keyCode));
                }
                
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
    }, [])


    if (loading) return <span>Loading...</span>
    if (error) return <span>{error.message}</span>

    if (data) return (
        <div className={style.wrapper}>
            <div className={style.taskListWrapper}>
            {data.tasks.map((task, i) => (
                <Task task={task} index={i+1} />
            ))}
            </div>
            <div>
                <CreateTask active={newTask} activationLetter={activationLetter} />
            </div>
        </div>
    )

    return <div></div>
}

export default TaskList;