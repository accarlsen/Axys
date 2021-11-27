import React from 'react';
import { useMutation } from '@apollo/client';

import style from './../taskList.module.css'
import { deleteTask, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';

function Task(props) {

    const id = localStorage.getItem("personId");

    //Queries & mutations
    const [DeleteTask, { errorD }] = useMutation(deleteTask)

    //Methods
    const deleteTaskQuery = (event) => {
        event.preventDefault();
        DeleteTask({
            variables: {
                id: props.task.id
            },
            refetchQueries: [{ query: getTasks }]
        });
    }

    return (
        <div key={props.index} className={style.taskWrapper}>
            <div className={style.taskContent}>
                <p className={style.taskNum}>{props.index}</p>
                <div>
                    <p className={style.taskName}>{props.task.name}</p>
                    {id !== props.task.authorId ? <div className={style.authorDisplay}><Link className={`p ${style.link}`} to={"/profile/" + props.task.assignee.id}>
                        {props.task.assignee.fname + " " + props.task.assignee.lname}
                    </Link></div> : <div className={style.authorDisplayPlaceholder}></div>}
                </div>
                <button className={style.removeTask} onClick={(e) => deleteTaskQuery(e)}>x</button>
            </div>

        </div>
    )
}

export default Task;