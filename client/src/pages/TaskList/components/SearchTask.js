import React, { useEffect, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { addTask, deleteTask, getTasks, taskDone } from '../../../components/queries';
import { printIntrospectionSchema } from 'graphql';

import style from './../taskList.module.css'

function SearchTask(props) {
    const [search, setSearch] = useState("");
    const [id, setId] = useState("");
    const [task, setTask] = useState();

    const [active, setActive] = useState(false);

    const [TaskDone, { error }] = useMutation(taskDone, {
        variables: { id: id }
    })

    const [DeleteTask, { errorD }] = useMutation(deleteTask, {
        variables: { id: id }
    })

    const authorId = localStorage.getItem("personId");

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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); //very important for some reason
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
        else if (event.key === 'Delete') {
            event.preventDefault(); //very important for some reason
            DeleteTask({
                variables: {
                    id: id
                },
                refetchQueries: [{ query: getTasks, variables: { authorId: authorId } }]
            });
            setSearch("");
            setActive(false); 
        }
        else if (event.key === 'Escape') {
            setActive(false);
            setSearch("");
            setTask();
            setId(""); 
        }
    }

    if (error) {
        console.log("error: ", error.message);
    };
    if (errorD) {
        console.log("error: ", errorD.message);
    };

    if (active) {
        return (
            <div className={style.STWrapper} onKeyDown={handleKeyDown}>
                <div className={style.STInner}>
                    <div className={style.STGrid}>
                        <input type={"number"} className="inputNoBorder" autoFocus={true} value={search} placeholder={"search tasks..."} onChange={e => { setSearch(String(e.target.value)); }}></input>

                        <span className="button red" onClick={() => { setActive(false); setSearch(""); setTask(); setId("") }}>Delete</span>

                    </div>
                    <div className={style.STResults}>
                        {search.length > 0 && task !== null && task !== undefined && <div>
                            <span>{task.name}</span>
                            <span className="button green" onClick={e => {
                                e.preventDefault(); //very important for some reason
                                TaskDone({
                                    variables: {
                                        id: id,
                                        done: false,
                                    },
                                    refetchQueries: [{ query: getTasks, variables: { authorId: authorId } }]
                                });
                                setSearch("");
                                setActive(false);
                            }
                            }>Done</span>
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