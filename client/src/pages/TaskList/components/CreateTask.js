import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { addTask, getProfile, getTasks } from '../../../components/queries';

import style from './../taskList.module.css'

function CreateTask(props) {

    //Variables
    const id = localStorage.getItem("personId");

    const input = useRef(null);

    const [name, setName] = useState("");
    const [searchFriends, setSearchFriends] = useState(false);
    const [assigneeId, setAssigneeId] = useState(id);
    const [searchName, setSearchName] = useState("");

    let searchNameFirst = null;


    //Queries and mutations
    const { loading: loadingF, error: errorF, data: dataF } = useQuery(getProfile, {
        variables: { id: id }
    });

    const [AddTask, { error }] = useMutation(addTask, {
        variables: { name }
    })

    useEffect(() => {
        
    }, [searchName])

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
        props.setTaskActive(false);
        setName("");
    }

    const cancel = () => {
        props.setTaskActive(false);
        setSearchFriends(false)
        setSearchName("")
        searchNameFirst = null
        setName("");
    }

    const selectAssignee = (friend) => {
        setName(name + friend.name + " ");
        setAssigneeId(friend.id); 
        setSearchFriends(false);
        setSearchName("")
        searchNameFirst = null
        input.current.focus();
    }

    const searchNames = (searchWord, friends) => {
        const sortedFriends = friends.filter((i) => {
            return i.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1
        });
        console.log(sortedFriends[0]);
        return sortedFriends;
    }

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (!searchFriends && event.key === 'Enter' && (String(name.replace(/\s/g, '')).length >= 1)) {
            addTaskQuery(event);
        }
        else if (searchFriends && event.key === 'Enter') {
            setSearchFriends(false)
            setSearchName("")
            if(searchNameFirst !== null){
                setAssigneeId(searchNameFirst.id);
                setName(name + searchNameFirst.name + " ");
            }
            searchNameFirst = null
            input.current.focus();
        }
        else if (event.key === '@') {
            console.log("@")
            setName(name + "@")
            setSearchFriends(true)
        }
        else if (searchFriends && event.key === 'Escape') {
            setSearchFriends(false)
            setSearchName("")
            searchNameFirst = null
            input.current.focus();
        }
        else if (!searchFriends && event.key === 'Escape') {
            cancel();
        }
    }

    if (error) {
        console.log("error: ", error);
    };

    //DOM
    if (props.taskActive && dataF) {
        searchNameFirst = dataF.profile.friends[0];
        return (
            <div className={style.CTWrapper} onKeyDown={handleKeyDown}>
                <div className={style.CTInnerWrapper}>
                    <input className="inputNoBorder" ref={input} autoFocus={true} value={name} placeholder={"name..."} onChange={e => { setName(String(e.target.value)); }}></input>
                    <span className="button grey" onClick={() => { cancel() }}>Cancel</span>
                    <span className="button green" onClick={e => { addTaskQuery(e) }}>Create</span>
                
                    {searchFriends && <div className={style.CTFriendListWapper}>
                        <input className={` ${style.CTfriendSearch} inputNoBorder`} autoFocus={true} value={searchName} onChange={(e) => { if(e.target.value !== '@') setSearchName(e.target.value);}} />
                        {searchName === "" ? dataF.profile.friends.map((friend, i) => (
                            <button className={i === 0 ? style.CTFriendListItemTop : style.CTFriendListItem} onClick={e => {selectAssignee(friend)}}>
                                {friend.fname + " " + friend.lname}
                            </button>
                        ))
                        : 
                        searchNames(searchName, dataF.profile.friends).map((friend, i) => (
                            <button className={i === 0 ? style.CTFriendListItemTop : style.CTFriendListItem} onClick={e => {selectAssignee(friend)}}>
                                {friend.name}
                            </button>
                        ))}
                    </div>}
                </div>
            </div>
        )
    }
    return (
        <div className={style.CTPreview} onClick={() => props.setTaskActive(true)}>
            <span className={style.taskNum} >+ New Task</span>
        </div>
    )
}

export default CreateTask;