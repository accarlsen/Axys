import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import style from './../taskList.module.css'
import { deleteTask, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';
import CommentList from './commentList';
import CommentIcon from './../assets/CommentIcon.svg'

function Task(props) {

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
        <div key={props.index} className={` ${style.taskWrapper} ${props.task.accepted === false ? style.goldenShine : ""}`}>
            <div className={style.taskContent}>
                <p className={style.taskNum}>{props.index}</p>
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
                <button className={style.removeTask} onClick={(e) => deleteTaskQuery(e)}>x</button>
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