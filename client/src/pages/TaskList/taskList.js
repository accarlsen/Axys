import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getTasks } from '../../components/queries';
import CreateTask from './components/CreateTask';

import style from './taskList.module.css'
import Task from './components/task';
import SearchTask from './components/SearchTask';
import { useHistory } from 'react-router-dom';


function TaskList() {

    //Variables
    const [taskActive, setTaskActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [activationLetter, setActivationLetter] = useState("");
    const [activationNumber, setActivationNumber] = useState("");
    const history = useHistory();

    const CTRef = useRef(null)
    const STRef = useRef(null)

    //Queries
    const { loading, error, data } = useQuery(getTasks);

    //UseEffect, runs upon any update to component
    useEffect(() => {
        const handleDown = (event) => {

            if (event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey && !event.altGraphKey && event.key !== '@') {
                //Number
                if (!searchActive && !taskActive) {
                    setActivationNumber(String.fromCharCode(event.keyCode));
                    setSearchActive(true);
                }
            }
            else if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
                //Higher and lower case letters
                if (!taskActive && !searchActive) {
                    setActivationLetter(String.fromCharCode(event.keyCode));
                    setTaskActive(true);
                }
            }
            /*else if (event.key === 'Enter' || event.key === 'Escape' || event.key === 'Delete') {
                //Reset states
            }*/
        }

        const handleUp = (event) => {
            //Yet to be implemented
        }

        window.addEventListener("keyup", handleUp)
        window.addEventListener("keydown", handleDown)

        return () => {
            window.removeEventListener("keyup", handleUp)
            window.removeEventListener("keydown", handleDown)
        }
    })

    //Methods
    const routeChange = () => {
        history.push("/login")
    }


    if (loading) return <span>Loading...</span>
    if (error) {
        console.log(error.message);
        if (error.message === 'Unauthenticated user') {
            localStorage.setItem('admin', false);
            localStorage.removeItem('token');
            routeChange();
        }
    }

    //DOM
    if (data) {
        let sortedData = [...data.tasks];
        console.log(sortedData)
        sortedData.sort(function (x, y) {
            // false values first
            return (x.accepted === y.accepted) ? 0 : x ? -1 : 1;
        });

        return (
            <div className={style.wrapper}>
                <div className={style.taskListWrapper}>
                    {sortedData.map((task, i) => (
                        <Task task={task} isAssignment={false} index={i + 1} />
                    ))}
                </div>
                <CreateTask ref={CTRef} taskActive={taskActive} setTaskActive={setTaskActive} activationLetter={activationLetter} setActivationLetter={setActivationLetter} />
                <SearchTask ref={STRef} searchActive={searchActive} setSearchActive={setSearchActive} activationNumber={activationNumber} setActivationNumber={setActivationNumber} tasks={data.tasks} />
            </div>
        )
    }

    return <div></div>
}

export default TaskList;