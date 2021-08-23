import React, { useEffect, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { addTask, getSubTasks } from './../components/queries';
import './../style/create-task.css'

function CreateSubTask(props) {
        
    const [name, setName] = useState("");
    const [time, setTime] = useState("");
    const [progress, setProgress] = useState("");
    const [weight, setWeight] = useState(Number(0));
    const [weightName, setWeightName] = useState("");

    const [newTask, setNewTask] = useState(false);


    const [AddTask, { data, error }] = useMutation(addTask, {
        variables: { name, time, weight, weightName }
    })
    if (error) {
        console.log("error: ", error);
    };

    if (newTask) {
        return (
            <div className="create-subtask-wrapper">
                <div className="create-subtask-input-wrapper">
                    <input autoFocus={true} className="create-subtask-input" value={name} placeholder={"name..."} onChange={e => { setName(String(e.target.value)); }}></input>
                    <input className="create-subtask-input" value={time} placeholder={"time..."} onChange={e => { setTime(String(e.target.value)); }}></input>
                    {/*<input value={progress} onChange={e => setProgress(e.target.value)}></input>*/}
                    <input className="create-subtask-input" value={weight} placeholder={"weight..."} onChange={e => { setWeight(Number(e.target.value)); }}></input>
                    <input className="create-subtask-input" value={weightName} placeholder={"type of weight..."} onChange={e => { setWeightName(String(e.target.value)); }}></input>

                    <span className="create-subtask-button" onClick={() => setNewTask(false)}>Cancel</span>
                    <button className="create-subtask-button" onClick={e => {
                        e.preventDefault(); //very important for some reason
                        AddTask({
                            variables: {
                                name: name,
                                time: time,
                                done: false,
                                weight: weight,
                                weightName: props.weightName,
                                progress: false,
                                authorId: "5f5b2ae72638cb30dc24b811",
                                parentId: props.parentId
                            },
                            refetchQueries: [{ query: getSubTasks }]
                        });
                        setName("");
                        setTime("");
                        setWeight(0);
                        setWeightName("");
                        setNewTask(false);
                    }
                    }>Create</button>
                </div>
            </div>
        )
    }
    return (
        <div className="create-subtask-wrapper">
            <span className="create-subtask-expander" onClick={() => setNewTask(true)}>+ New Subtask</span>
        </div>
    )
}

export default CreateSubTask;