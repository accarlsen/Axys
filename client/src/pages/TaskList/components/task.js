import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import style from './../taskList.module.css'
import { deleteTask, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';
import CommentList from './commentList';
import CommentIcon from './../assets/CommentIcon.svg'

function Task(props) {

    let planned = false;
    if (props.planned) planned = true;

    const id = localStorage.getItem("personId");
    const [showComments, setShowComments] = useState(false)
    const [isChecked, setIsChecked] = useState(props.plannedTasks.includes(props.task.id))

    //Queries & mutations
    const [DeleteTask, { errorD }] = useMutation(deleteTask)

    useEffect(() => {
        setIsChecked(props.plannedTasks.includes(props.task.id))
    }, [props.plannedTasks])

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

    const manipulatePlannedTasks = () => {
        let array = props.plannedTasks

        if (props.plannedTasks.includes(props.task.id)) {
            const index = props.plannedTasks.indexOf(props.task.id);
            if (index > -1) {
                array.splice(index, 1);
                props.setPlannedTasks(array)
                setIsChecked(false)
            }
        } else {
            array.push(props.task.id);
            props.setPlannedTasks(array)
            setIsChecked(true)
        }

        setIsChecked(props.plannedTasks.includes(props.task.id))
    }

    return (
        <div key={props.index} className={` ${style.taskWrapper} ${props.task.accepted === false ? style.goldenShine : ""}`}>
            <div className={style.taskContent}>
                {props.isPlanning && !planned ?
                <span className={`${style.doneButton}`} onClick={() => manipulatePlannedTasks()}>
                    {isChecked && <svg className={style.doneCheckmark} viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="#25D195" strokeWidth="35" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                    </svg>}
                </span>
                :
                <p className={style.taskNum}>{props.index}</p>}
                <div>
                    <p className={style.taskName}>{props.task.name}</p>
                    <div className={style.taskUnderText}>
                        <div>
                            {id !== props.task.authorId ? <div className={style.authorDisplay}><span className="ps">{props.task.accepted ? "From " : "Suggested by "}</span><Link className={`ps ${style.link}`} to={"/profile/" + props.task.author.id}>
                                {props.task.author.name}
                            </Link></div> : <div className={style.authorDisplayPlaceholder}></div>}
                            {props.isAssignment && <div className={style.authorDisplay}><span className="ps">Assigned to </span><Link className={`ps ${style.link}`} to={"/profile/" + props.task.assignee.id}>
                                {props.task.assignee.name}
                            </Link></div>}
                        </div>
                        <div className={style.authorDisplay}>
                            <Status isAssignment={props.isAssignment} task={props.task} />
                        </div>
                    </div>
                </div>
                {props.task.comments.length > 0 ?
                    <button className={style.commentIconWrapperLen} onClick={() => { showComments ? setShowComments(false) : setShowComments(true) }}>
                        <span>{props.task.comments.length}</span>
                        <img className={style.commentIcon} src={CommentIcon} alt={"Comment Icon"} />
                    </button>
                    :
                    <button className={style.commentIconWrapper} onClick={() => { showComments ? setShowComments(false) : setShowComments(true) }}>
                        <span>+</span>
                        <img className={style.commentIcon} src={CommentIcon} alt={"Comment Icon"} />
                    </button>
                }
                {props.task.authorId === id ? <button className={style.removeTask} onClick={(e) => deleteTaskQuery(e)}>x</button> : <span></span>}
            </div>
            <div className={style.commentListWrapper}>
                <CommentList task={props.task} showComments={showComments} isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment} />
            </div>
        </div>
    )
}

function Status(props) {
    if (props.isAssignment) {
        if (props.task.done) return (
            <p className={`ps ${style.statusCompleted}`}>Completed</p>
        )
        else if (props.task.accepted) return (
            <p className={`ps ${style.statusAccepted}`}>Accepted</p>
        )
        else if (props.task.ignored) return (
            <p className={`ps ${style.statusIgnored}`}>Ignored</p>
        )
    }
    return (
        <div></div>
    )
}

export default Task;