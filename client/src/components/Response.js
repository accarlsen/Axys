import React, { useState, useEffect, useContext } from 'react';
import './../style/navbar.css';
import { Link } from "react-router-dom";
import { useSpring, animated as a } from 'react-spring';
import { AuthContext } from './../context/auth-context';

import { gql, useQuery, useMutation } from '@apollo/client';
import { getSubTasks, taskDone, deleteTask } from './../components/queries';


function Response(props) {
    const [id, setId] = useState(String(props.subtasks.id));
    const [done, setDone] = useState(props.subtasks.done);

    const context = useContext(AuthContext);

    useEffect(
        () => {
        }, [done]
    );

    const [TaskDone, { error1 }] = useMutation(taskDone, {
        variables: { id, done },
        
    })
    if (error1) {
        console.log("error: ", error1);
    };

    const [DeleteTask, { error2 }] = useMutation(deleteTask, {
        variables: { id }
    })
    if (error2) {
        console.log("error: ", error2);
    };

    if (done) {
        return (
            <div>
                <div className="response-wrapper">
                    <span className="done-button" onClick={e => {
                        let doneBool = false;
                        if (done) { setDone(false); doneBool = false }
                        else { setDone(true); doneBool = true }
                        console.log(id)
                        console.log(doneBool)
                        e.preventDefault();
                        TaskDone({ variables: { id: id, done: doneBool }, refetchQueries: [{ query: getSubTasks }] })
                        props.updater(1);
                    }}>
                        <svg className="done-checkmark" viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="#25D195" strokeWidth="40" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                        </svg>
                    </span>
                    <span className="response-text-done">{props.subtasks.name}</span>
                    <span className="response-text-done">{"finished: " + props.subtasks.time}</span>
                    <span className="response-text-done">{props.subtasks.weightName + ": " + props.subtasks.weight}</span>
                    <span className="response-delete-button" onClick={e => {
                        e.preventDefault();
                        DeleteTask({ variables: { id: id } })
                    }}>Delete</span>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="response-wrapper">
                <span className="done-button" onClick={e => {
                    let doneBool = false;
                    if (done) { setDone(false); doneBool = false }
                    else { setDone(true); doneBool = true }
                    e.preventDefault();
                    TaskDone({ variables: { id: id, done: doneBool } })
                    props.updater(1);
                }}></span>
                <span className="response-text">{props.subtasks.name}</span>
                <span className="response-text">{props.subtasks.time}</span>
                <span className="response-text">{props.subtasks.weightName + ": " + props.subtasks.weight}</span>
                <span className="response-delete-button" onClick={e => {
                    e.preventDefault();
                    DeleteTask({ variables: { id: id } })
                }}>Delete</span>
            </div>
        </div>
    )
}

export default Response;