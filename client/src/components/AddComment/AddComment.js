import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import style from './addComment.module.css'
import { addComment, deleteTask, getComments, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';

function AddComment(props) {

    const [text, setText] = useState("")

    //Queries & mutations
    const [AddComment, { errorC }] = useMutation(addComment, {
        variables: { text: "comment", taskId: props.task.id }
    })

    //Methods
    const addCommentQuery = (event) => {
        event.preventDefault();
        AddComment({
            variables: {
                text: "comment",
                taskId: props.task.id
            },
            refetchQueries: [{ query: getTasks }]
        });
    }

    return (
        <div className={style.wrapper}>
            <input className="inputNoBorder" autoFocus={true} value={text} placeholder={"Add Comment..."} onChange={e => { setText(String(e.target.value)); }}></input>
            <button className="button-small green" onClick={(e) => addCommentQuery(e)}>Add</button>
        </div>
    )
}

export default CommentList;