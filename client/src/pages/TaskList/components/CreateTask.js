import React, { useEffect, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { addTask, getTasks } from '../../../components/queries';
import { printIntrospectionSchema } from 'graphql';

import style from './../taskList.module.css'

function CreateTask(props) {
    
    //Variables
    const [name, setName] = useState("");
    const [newTask, setNewTask] = useState(false);

    //Queries and mutations
    const [AddTask, { error }] = useMutation(addTask, {
        variables: { name }
    })

    //Methods
    const addTaskQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        AddTask({
            variables: {
                name: name,
                assigneeId: localStorage.getItem("personId"),
            },
            refetchQueries: [{ query: getTasks }]
        });
        setNewTask(false);
        setName("");
    }

    const cancel = () => {
        setNewTask(false);
        setName("");
    }
   
    //USeeffect, runs when component activation status is updated
    useEffect(() => {
        if (!newTask) {
            setNewTask(props.active)
            setName(props.activationLetter)
        } else{
            setNewTask(props.active)
        }
    }, [props.active]);

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && (String(name.replace(/\s/g, '')).length >= 1)) {
            addTaskQuery(event);
        }
        else if (event.key === 'Escape') {
            cancel();
        }
    }

    if (error) {
        console.log("error: ", error);
    };

    //DOM
    if (newTask) {
        return (
            <div className={style.CTWrapper} onKeyDown={handleKeyDown}>
                <input className="inputNoBorder" autoFocus={true} value={name} placeholder={"name..."} onChange={e => { setName(String(e.target.value)); }}></input>
                <span className="button grey" onClick={() => { cancel() }}>Cancel</span>
                <span className="button green" onClick={e => { addTaskQuery(e) } }>Create</span>
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