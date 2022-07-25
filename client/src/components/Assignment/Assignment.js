import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import style from './assignment.module.css'
import { deleteTask, getTasks } from '../queries';
import { Link } from 'react-router-dom';
import CommentIcon from './assets/CommentIcon.svg'
import CommentList from '../CommentList/CommentList';

function Assignment(props) {

    const id = localStorage.getItem("personId");
    const [showComments, setShowComments] = useState(false)

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
        <div key={props.index} className={` ${style.taskWrapper}`}>
            <div className={style.taskContent}>
                <p className={style.taskNum}>{props.index}</p>
                <div>
                    <p className={style.taskName}>{props.task.name}</p>
                    <div className={style.taskUnderText}>
                        <div className={style.authorDisplay}><span className="ps">Assigned to </span><Link className={`ps ${style.link}`} to={"/profile/" + props.task.assignee.id}>
                            {props.task.assignee.name}
                        </Link></div>
                        <div className={style.authorDisplay}>
                            <Status task={props.task} />
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
    if (props.task.done) return (
        <span className={`ps ${style.statusCompleted}`}>Completed</span>
    )
    else if (props.task.accepted) return (
        <span className={`ps ${style.statusAccepted}`}>Accepted</span>
    )
    else if (props.task.ignored) return (
        <span className={`ps ${style.statusIgnored}`}>Ignored</span>
    )
    else return (
        <div></div>
    )
}

export default Assignment;