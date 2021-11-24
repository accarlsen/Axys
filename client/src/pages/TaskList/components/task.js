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
            <p className={style.taskNum}>{props.index}</p>
            <p className={style.taskName}>{props.task.name}</p>
            <button className={style.removeTask} onClick={(e) => deleteTaskQuery(e)}>x</button>
            {id !== props.task.authorId && <div><span className="p">From: </span><Link to={"/profile/" + props.task.assignee.id}>
                <span className="p">{props.task.assignee.fname + " " + props.task.assignee.lname}</span>
            </Link></div>}
        </div>
    )
}

export default Task;