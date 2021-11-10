import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { addTask, getProfile, getTasks } from '../../../components/queries';

import style from './../taskList.module.css'

function CreateTask(props) {

    //Variables
    const [name, setName] = useState("");
    const [newTask, setNewTask] = useState(false);
    const [searchFriends, setSearchFriends] = useState(false);

    const id = localStorage.getItem("personId");

    //Queries and mutations
    const { loading: loadingF, error: errorF, data: dataF } = useQuery(getProfile, {
        variables: { id: id }
    });

    const [AddTask, { error }] = useMutation(addTask, {
        variables: { name }
    })

    //Methods
    const addTaskQuery = (event) => {
        event.preventDefault(); //Enable custom behaviour
        AddTask({
            variables: {
                name: name,
                assigneeId: id,
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

    //UseEffect, runs when component activation status is updated
    useEffect(() => {
        if (!newTask) {
            setNewTask(props.active)
            setName(props.activationLetter)
        } else {
            setNewTask(props.active)
        }
    }, [props.active]);

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (!searchFriends && event.key === 'Enter' && (String(name.replace(/\s/g, '')).length >= 1)) {
            addTaskQuery(event);
        }
        if (searchFriends && event.key === 'Enter') {
            setSearchFriends(false)
        }
        if (event.key === '@') {
            console.log("@")
            setSearchFriends(true)
        }
        else if (!searchFriends && event.key === 'Escape') {
            cancel();
        }
        else if (searchFriends && event.key === 'Escape') {
            setSearchFriends(false)
        }
    }

    if (error) {
        console.log("error: ", error);
    };

    //DOM
    if (newTask && dataF) {
        return (
            <div className={style.CTWrapper} onKeyDown={handleKeyDown}>
                <div className={style.CTInnerWrapper}>
                    {searchFriends && <div className={style.CTFriendListWapper}>
                        {dataF.profile.friends.map((friend) => (
                            <div>
                                <p>{friend.fname + " " + friend.lname}</p>
                            </div>
                        ))}
                    </div>}

                    <input className="inputNoBorder" autoFocus={true} value={name} placeholder={"name..."} onChange={e => { if( e.target.value !== '@' ) setName(String(e.target.value)); }}></input>
                    <span className="button grey" onClick={() => { cancel() }}>Cancel</span>
                    <span className="button green" onClick={e => { addTaskQuery(e) }}>Create</span>
                </div>
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