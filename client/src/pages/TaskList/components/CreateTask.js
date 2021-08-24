import React, { useEffect, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { addTask, getTasks } from '../../../components/queries';
import { printIntrospectionSchema } from 'graphql';

import style from './../taskList.module.css'

function CreateTask(props) {
    const [name, setName] = useState(props.activationLetter);

    const [newTask, setNewTask] = useState(false);

    const [AddTask, { error }] = useMutation(addTask, {
        variables: { name }
    })

    const authorId = localStorage.getItem("personId");

    useEffect(() => {
        setNewTask(props.active)
    }, [props]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && (String(name.replace(/\s/g, '')).length >= 1)) {
            event.preventDefault(); //very important for some reason
            AddTask({
                variables: {
                    name: name,
                    authorId: localStorage.getItem("personId"),
                },
                refetchQueries: [{ query: getTasks }]
            });
            setName("");
            setNewTask(false);
        }
        else if (event.key === 'Escape') {
            setNewTask(false);
            setName("")
        }
    }

    if (error) {
        console.log("error: ", error);
    };

    if (newTask) {
        return (
            <div className={style.CTWrapper} onKeyDown={handleKeyDown}>
                <input className="inputNoBorder" autoFocus={true} value={name} placeholder={"name..."} onChange={e => { setName(String(e.target.value)); }}></input>

                <span className="button red" onClick={() => { setNewTask(false); setName("") }}>Cancel</span>
                <span className="button green" onClick={e => {
                    e.preventDefault(); //very important for some reason
                    AddTask({
                        variables: {
                            name: name,
                            authorId: localStorage.getItem("personId"),
                        },
                        refetchQueries: [{ query: getTasks, variables: { authorId: authorId } }]
                    });
                    setName("");
                    setNewTask(false);
                }
                }>Create</span>
            </div>
        )
    }
    return (
        <div className={style.CTPreview} onClick={() => setNewTask(true)}>
            <span className={style.taskNum} >+ New Task</span>
        </div>
    )
}

export default CreateTask;