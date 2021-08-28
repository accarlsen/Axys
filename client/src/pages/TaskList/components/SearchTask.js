import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { getTasks, taskDone, deleteTask } from '../../../components/queries';

import style from './../taskList.module.css'

function SearchTask(props) {

    //Variables
    const [search, setSearch] = useState("");
    const [id, setId] = useState("");
    const [task, setTask] = useState();
    const [active, setActive] = useState(false);
    
    const authorId = localStorage.getItem("personId");

    //Queries & mutations
    const [TaskDone, { error }] = useMutation(taskDone, {
        variables: { id: id }
    })

    const [DeleteTask, { errorD }] = useMutation(deleteTask, {
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
            refetchQueries: [{ query: getTasks, variables: { authorId: authorId } }]
        });
        setSearch("");
        setActive(false);
    }

    const deleteTaskQuery = (event) => {
        event.preventDefault();
        DeleteTask({
            variables: {
                id: id
            },
            refetchQueries: [{ query: getTasks, variables: { authorId: authorId } }]
        });
        setSearch("");
        setActive(false); 
    }

    const cancel = () => {
        setActive(false); setSearch(""); setTask(); setId("")
    }

    //UseEffect, runs upon update of component activation status or of selected states
    useEffect(() => {
        if (!active) {
            setActive(props.active)
            setSearch(props.activationNumber)
        } else {
            setActive(props.active)
        }

        console.log(props.tasks[0])
        if (search.length > 0 && search -1 < props.tasks.length) {
            setTask(props.tasks[parseInt(search, 10) - 1]);
            setId(props.tasks[parseInt(search, 10) - 1].id)
        } else if (search -1 > props.tasks.length || search -1 < 0) {
            setTask();
            setId("");
        }

    }, [props.active, search, id]);

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            updateStatusQuery(event);
        }
        else if (event.key === 'Delete') {
            deleteTaskQuery(event);
        }
        else if (event.key === 'Escape') {
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
    if (active) {
        return (
            <div className={style.STWrapper} onKeyDown={handleKeyDown}>
                <div className={style.STInner}>
                    <div className={style.STGrid}>
                        <input type={"number"} className="inputNoBorder" autoFocus={true} value={search} placeholder={"search tasks..."} onChange={e => { setSearch(String(e.target.value)); }}></input>
                        <button className={style.removeTask} >x</button>
                    </div>
                    <div className={style.STResults}>
                        {search.length > 0 && task !== null && task !== undefined && <div>
                            <span className={style.STResText}>{task.name}</span>
                            <span className="button red" onClick={(e) => { deleteTaskQuery(e) }}>Delete</span>
                            <span className="button green" onClick={e => { updateStatusQuery(e); } }>Done</span>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={style.STPreview} onClick={() => setActive(true)}>
            <span className={style.taskNum} >Search Tasks</span>
        </div>
    )
}

export default SearchTask;