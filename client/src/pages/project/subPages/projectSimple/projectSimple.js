import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getTasks, getTasksInProject } from '../../../../components/queries';

import style from './projectSimple.module.css'
import { useHistory } from 'react-router-dom';
import Task from '../../../../components/Task/Task';
import PlanDay from '../../../../components/PlanDay/planDay';
import SearchTask from '../../../../components/SearchTask/SearchTask';
import CreateTask from '../../../../components/CreateTask/CreateTask';


function ProjectSimple(props) {

    //Variables
    let id = props.project.id
    let includeCompleted = false

    const [taskActive, setTaskActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [activationLetter, setActivationLetter] = useState("");
    const [activationNumber, setActivationNumber] = useState("");
    const [isWritingComment, setIsWritingComment] = useState(false)
    const history = useHistory();

    const [isPlanning, setIsPlanning] = useState(false)
    const [plannedTasks, setPlannedTasks] = useState([])

    //Queries
    const { loading, error, data } = useQuery(getTasksInProject, {
        variables: { id: id, includeCompleted: includeCompleted }
    });

    //UseEffect, runs upon any update to component
    useEffect(() => {
        const handleDown = (event) => {

            if (!isWritingComment && event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey && !event.altGraphKey && event.key !== '@') {
                //Number
                if (!searchActive && !taskActive) {
                    setActivationNumber(String.fromCharCode(event.keyCode));
                    setSearchActive(true);
                }
            }
            else if ((!isWritingComment && event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
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

    //DOM
    if (loading) return <span>Loading...</span>
    if (error) {
        console.log(error.message);
        if (error.message === 'Unauthenticated user') {
            localStorage.setItem('admin', false);
            localStorage.removeItem('token');
            routeChange();
        }
    }

    if (data) {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        console.log(data)
        let plannedTasksTemp = [];

        if (data.tasksInProject?.length > 0) plannedTasksTemp = [...data.tasksInProject];

        let plannedTasksData = [];
        let sortedData = [];

        for (let i = 0; i < plannedTasksTemp.length; i++) {
            if (plannedTasksTemp[i].plannedDate === date) {
                plannedTasksData.push(plannedTasksTemp[i])
            } else {
                sortedData.push(plannedTasksTemp[i])
            }
        }

        sortedData.sort(function (x, y) {
            // false values first
            return (x.accepted === y.accepted) ? 0 : x ? -1 : 1;
        });

        let allTasks = [...plannedTasksData];
        allTasks.push(...sortedData);


        return (
            <div className={style.wrapper}>
                <div className={style.topBar}>
                    <SearchTask
                        searchActive={searchActive}
                        setSearchActive={setSearchActive}
                        activationNumber={activationNumber}
                        setActivationNumber={setActivationNumber}
                        tasks={allTasks}
                        isWritingComment={isWritingComment}
                        setIsWritingComment={setIsWritingComment}
                    />
                    <PlanDay isPlanning={isPlanning} setIsPlanning={setIsPlanning} plannedTasks={plannedTasks} setPlannedTasks={setPlannedTasks} plannedTasksData={plannedTasksData} />
                </div>

                <div className={style.innerWrapper}>

                    <div className={style.taskListOuterWrapper}>
                        <div className={style.taskListWrapper}>
                            <div className={style.titleWrapper}>
                                <h1 className="h4">{props.project.name}</h1>
                                <p className="p mb-1">{props.project.description}</p>
                            </div>
                        </div>

                        <div className={style.taskListWrapper}>
                            <div className={style.titleWrapper}>
                                <h1 className="h4">Tasks</h1>
                            </div>
                            {allTasks.map((task, i) => (
                                <Task
                                    task={task}
                                    index={i + 1}
                                    isWritingComment={isWritingComment}
                                    setIsWritingComment={setIsWritingComment}

                                    isPlanning={isPlanning}
                                    setIsPlanning={setIsPlanning}
                                    plannedTasks={plannedTasks}
                                    setPlannedTasks={setPlannedTasks}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <CreateTask
                    taskActive={taskActive}
                    setTaskActive={setTaskActive}
                    activationLetter={activationLetter}
                    setActivationLetter={setActivationLetter}
                    projectId={props.project.id}
                />
            </div>
        )
    }

    return <div></div>
}

export default ProjectSimple;