import React, { useEffect, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { addTask, getTasks } from './../components/queries';
import './../style/create-task.css'
import { printIntrospectionSchema } from 'graphql';

function CreateTask(props) {
    const [name, setName] = useState(props.activationLetter);

    const [newTask, setNewTask] = useState(false);

    const [AddTask, { error }] = useMutation(addTask, {
        variables: { name }
    })

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
            <div className="create-task-wrapper" onKeyDown={ handleKeyDown }>
                <div className="create-task-input-wrapper">
                    <input className="create-task-input" autoFocus={true} value={name} placeholder={"name..."} onChange={e => { setName(String(e.target.value)); }}></input>

                    <span className="create-task-button" onClick={() => { setNewTask(false); setName("") }}>Cancel</span>
                    <span className="create-task-button" onClick={e => {
                        e.preventDefault(); //very important for some reason
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
                    }>Create</span>
                </div>
            </div>
        )
    }
    return (
        <div className="create-task-wrapper">
            <span className="create-task-expander" onClick={() => setNewTask(true)}>+ New Task</span>
        </div>
    )
}

export default CreateTask;