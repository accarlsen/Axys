import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { addTask, getProfile, getTasks } from '../../../components/queries';

import style from './../taskList.module.css'

function CreateTask(props) {

    //Variables
    const id = localStorage.getItem("personId");

    const input = useRef(null)

    const [name, setName] = useState("");
    const [newTask, setNewTask] = useState(false);
    const [searchFriends, setSearchFriends] = useState(false);
    const [assigneeId, setAssigneeId] = useState(id)
    const [searchName, setSearchName] = useState("");


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
                assigneeId: assigneeId,
            },
            refetchQueries: [{ query: getTasks }]
        });
        setNewTask(false);
        setName("");
    }

    const cancel = () => {
        setNewTask(false);
        setSearchFriends(false)
        setSearchName("")
        setName("");
    }

    const selectAssignee = (friend) => {
        setName(name + friend.fname + " ");
        setAssigneeId(friend.id); 
        setSearchFriends(false);
        setSearchName("")
        input.current.focus();
    }

    const searchNames = (searchWord, friends) => {
        return friends.filter((i) => {
            return i.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1
        })
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
            setSearchName("")
        }
        if (event.key === '@') {
            console.log("@")
            setName(name + "@")
            setSearchFriends(true)
        }
        else if (event.key === 'Escape') {
            cancel();
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
                    <input className="inputNoBorder" ref={input} autoFocus={true} value={name} placeholder={"name..."} onChange={e => { setName(String(e.target.value)); }}></input>
                    <span className="button grey" onClick={() => { cancel() }}>Cancel</span>
                    <span className="button green" onClick={e => { addTaskQuery(e) }}>Create</span>
                
                    {searchFriends && <div className={style.CTFriendListWapper}>
                        <input className="inputNoBorder" autoFocus={true} value={searchName} onChange={(e) => { if(e.target.value !== '@') setSearchName(e.target.value);}} />
                        {searchName === "" ? dataF.profile.friends.map((friend) => (
                            <button className={style.CTFriendListItem} onClick={e => {selectAssignee(friend)}}>
                                {friend.fname + " " + friend.lname}
                            </button>
                        ))
                        : 
                        searchNames(searchName, dataF.profile.friends).map((friend) => (
                            <button className={style.CTFriendListItem} onClick={e => {selectAssignee(friend)}}>
                                {friend.name}
                            </button>
                        ))}
                    </div>}
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