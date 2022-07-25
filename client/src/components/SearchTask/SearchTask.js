import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { animated, useSpring } from 'react-spring'
import { getTasks, taskDone, deleteTask, taskAccepted, taskIgnored, getProgress, planTask } from '../queries';
import CommentIcon from './../Task/assets/CommentIcon.svg'

import style from './searchTask.module.css'
import CommentList from '../CommentList/CommentList';

function SearchTask(props) {

    //Variables
    const userId = localStorage.getItem("personId")

    const [search, setSearch] = useState("");
    const [id, setId] = useState("");
    const [task, setTask] = useState();
    const [showComments, setShowComments] = useState(false);
    const idInput = useRef(null);

    //Animations
    const widen = useSpring({
        to: { width: props.searchActive ? "30rem" : "10rem", left: props.searchActive ? "0rem" : "10rem" },
        from: { width: props.searchActive ? "10rem" : "30rem", left: props.searchActive ? "10rem" : "0rem" },
        config: { mass: 1, tension: 100, friction: 1, clamp: true },
    })

    const fade = useSpring({
        to: { opacity: props.searchActive ? 1 : 0 },
        from: { opacity: props.searchActive ? 0 : 1 },
        config: { mass: 2, tension: 100, friction: 1, clamp: true },
    })

    //Queries & mutations
    const [TaskDone, { error }] = useMutation(taskDone, {
        variables: { id: id }
    })

    const [DeleteTask, { errorD }] = useMutation(deleteTask, {
        variables: { id: id }
    })

    const [TaskAccepted, { errorA }] = useMutation(taskAccepted, {
        variables: { id: id }
    })

    const [TaskIgnored, { errorI }] = useMutation(taskIgnored, {
        variables: { id: id }
    })

    const [PlanTask, {errorP}] = useMutation(planTask, {
        variables: {id: id}
    })

    //Methods
    const updateStatusQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        TaskDone({
            variables: {
                id: id,
                done: true,
            },
            refetchQueries: [{ query: getTasks }, { query: getProgress }]
        });
        closeST();
    }

    const deleteTaskQuery = (event) => {
        event.preventDefault();
        DeleteTask({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        closeST();
    }

    const acceptTaskQuery = (event) => {
        event.preventDefault();
        TaskAccepted({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        closeST();
    }

    const ignoreTaskQuery = (event) => {
        event.preventDefault();
        TaskIgnored({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        closeST();
    }

    const planTaskQuery = (event) => {
        event.preventDefault();
        PlanTask({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }, {query: getProgress}]
        });
        closeST();
    }

    const closeST = () => {
        setSearch("");
        setShowComments(false);
        props.setSearchActive(false);
    }

    const checkForPlannedTask = () => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if(task !== null && task !== undefined && task.plannedDate === date ) {
            return true;
        }
        return false
    }

    //UseEffect, runs upon update of component activation status or of selected states
    useEffect(() => {
        if (search.length > 0 && search > 0 && search - 1 < props.tasks.length) {
            setTask(props.tasks[parseInt(search, 10) - 1]);
            setId(props.tasks[parseInt(search, 10) - 1].id)
        } else if (search - 1 > props.tasks.length || search - 1 < 1) {
            setTask();
            setId("");
        }
    }, [search, id]);

    useEffect(() => {
        if (props.searchActive && !showComments) idInput.current.focus();
    }, [showComments])

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (task !== null && task !== undefined) {
            if (task.accepted) {
                if (!showComments && event.key === 'Enter') {
                    updateStatusQuery(event);
                }
                else if (event.key === 'Delete') {
                    deleteTaskQuery(event);
                }
            } else {
                if (event.key === 'Enter') {
                    acceptTaskQuery(event);
                }
                else if (event.key === 'Delete') {
                    ignoreTaskQuery(event);
                }
            }

        }
        if (event.key === 'Escape' && !showComments) {
            setSearch("");
            props.setSearchActive(false);
        }
        else if (event.key === 'Escape' && showComments) {
            setShowComments(false);
            props.setIsWritingComment(false);
        }
    }

    //Mutation error-handlers
    if (error) {
        console.log("error: ", error.message);
    };
    if (errorD) {
        console.log("error: ", errorD.message);
    };

    //DOM
    return (
        <div className={style.STWrapper} onKeyDown={handleKeyDown}>
            <div className={style.STInner}>
                <div className={props.searchActive ? style.STabsActive : style.STabs}>
                    {
                        props.searchActive ?
                            <div>
                                <div className={style.STGrid}>
                                    <input ref={idInput} type={"number"} className="inputNoBorder" autoFocus={true} value={search} placeholder={" id..."} onChange={e => { setSearch(String(e.target.value)); }}></input>
                                    {search.length > 0 && task !== null && task !== undefined &&
                                        <animated.div style={fade}>{task.accepted ?
                                            <div className={style.STButtonGrid}>
                                                {!checkForPlannedTask() && <button className="button-small grey" onClick={(e) => { planTaskQuery(e)}}>+ Daily Goals</button>}

                                                <button className={style.commentIconWrapperLenNoPadding} onClick={() => { showComments ? setShowComments(false) : setShowComments(true) }}>
                                                    <span>{task.comments.length > 0 ? task.comments.length : "+"}</span>
                                                    <img className={style.commentIcon} src={CommentIcon} alt={"Comment Icon"} />
                                                </button>

                                                {task.authorId === userId && <button className="button-small red" onClick={(e) => { deleteTaskQuery(e) }}>Delete</button>}
                                                {task.assigneeId === userId && <button className="button-small green" onClick={e => { updateStatusQuery(e); /*updateStatusQuery(e);*/ }}>Done</button>}
                                            </div>
                                            :
                                            <div className={style.STButtonGrid}>

                                                <button className="button grey" onClick={(e) => { ignoreTaskQuery(e) }}>Ignore</button>
                                                <button className="button green" onClick={e => { acceptTaskQuery(e); }}>Accept</button>
                                            </div>}
                                        </animated.div>}
                                </div>
                                <animated.div style={fade}>
                                    {search.length > 0 && task !== null && task !== undefined && <div>
                                        {task.accepted ? <div className={style.STResults}>
                                            <span className={style.STResText}>{task.name}</span>
                                            <div className={style.commentListWrapper}>
                                                <CommentList task={task} showComments={showComments} setShowComments={setShowComments} isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment} />
                                            </div>
                                        </div>
                                            :
                                            <div className={style.STResults}>
                                                <span className={style.STResText}>{task.name}</span>
                                                <div className={style.commentListWrapper}>
                                                    <CommentList task={task} showComments={showComments} setShowComments={setShowComments} isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment} />
                                                </div>
                                            </div>}
                                    </div>}
                                </animated.div>
                            </div>
                            :
                            <button className={`button grey ${style.SearchPreview}`} onClick={() => props.setSearchActive(true)}>
                                {"Search Tasks"}
                            </button>
                    }

                </div>
            </div>
        </div>
    )
}

export default SearchTask;