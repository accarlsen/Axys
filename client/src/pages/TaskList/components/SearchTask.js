import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { getTasks, taskDone, deleteTask, taskAccepted, taskIgnored, addComment, getProgress } from '../../../components/queries';

import style from './../taskList.module.css'

function SearchTask(props) {

    //Variables
    const [search, setSearch] = useState("");
    const [id, setId] = useState("");
    const [task, setTask] = useState();
    const [comment, setComment] = useState("Very interesting comment");

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

    //Methods
    const updateStatusQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        TaskDone({
            variables: {
                id: id,
                done: true,
            },
            refetchQueries: [{ query: getTasks }, {query: getProgress}]
        });
        setSearch("");
        props.setSearchActive(false);
    }

    const deleteTaskQuery = (event) => {
        event.preventDefault();
        DeleteTask({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        setSearch("");
        props.setSearchActive(false);
    }

    const acceptTaskQuery = (event) => {
        event.preventDefault();
        TaskAccepted({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        setSearch("");
        props.setSearchActive(false);
    }

    const ignoreTaskQuery = (event) => {
        event.preventDefault();
        TaskIgnored({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        setSearch("");
        props.setSearchActive(false);
    }

    const cancel = () => {
        props.setSearchActive(false); setSearch(""); setTask(); setId("")
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

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if(task !== null && task !== undefined){
            if(task.accepted){
                if (event.key === 'Enter') {
                    updateStatusQuery(event);
                }
                else if (event.key === 'Delete') {
                    deleteTaskQuery(event);
                }
            } else{
                if (event.key === 'Enter') {
                    acceptTaskQuery(event);
                }
                else if (event.key === 'Delete') {
                    ignoreTaskQuery(event);
                }
            }
            
        }
        if (event.key === 'Escape') {
            cancel();
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
    if (props.searchActive) {
        return (
            <div className={style.STWrapper} onKeyDown={handleKeyDown}>
                <div className={style.STInner}>
                    <div className={style.STGrid}>
                        <input type={"number"} className="inputNoBorder" autoFocus={true} value={search} placeholder={"search tasks..."} onChange={e => { setSearch(String(e.target.value)); }}></input>
                        <button className={style.removeTask} >x</button>
                    </div>
                    {search.length > 0 && task !== null && task !== undefined && <div>
                        {task.accepted ? <div className={style.STResults}>
                            <span className={style.STResText}>{task.name}</span>
                            <button className="button red" onClick={(e) => { deleteTaskQuery(e) }}>Delete</button>
                            <button className="button green" onClick={e => { updateStatusQuery(e); /*updateStatusQuery(e);*/ }}>Done</button>
                        </div>
                        :
                        <div className={style.STResults}>
                            <span className={style.STResText}>{task.name}</span>
                            <button className="button grey" onClick={(e) => { ignoreTaskQuery(e) }}>Ignore</button>
                            <button className="button green" onClick={e => { acceptTaskQuery(e); }}>Accept</button>
                        </div>}
                    </div>}
                </div>
            </div>
        )
    }
    return (
        <button className={`button grey ${style.SearchPreview}`} onClick={() => props.setSearchActive(true)}>
            Search Tasks
        </button>
    )
}

export default SearchTask;

function STCreateComment(props) {

    /*const [AddComment, {errorC}] = useMutation(addComment, {
        variables: {text: comment, taskId: id}
    })

    const addCommentQuery = (event) => {
        event.preventDefault();
        AddComment({
            variables: {
                text: comment,
                taskId: id
            },
            refetchQueries: [{ query: getTasks }]
        });
        setSearch("");
        setComment("");
        props.setSearchActive(false);
    }*/

    return(
        <div className={style.STCCWrapper}>

        </div>
    )
}