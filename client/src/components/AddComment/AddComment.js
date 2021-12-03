import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import style from './addComment.module.css'
import { addComment, getComments } from '../queries';

function AddComment(props) {

    const [text, setText] = useState("")

    //Queries & mutations
    const [AddComment, { errorC }] = useMutation(addComment, {
        variables: { text: text, taskId: props.task.id }
    })

    //Methods
    const addCommentQuery = (event) => {
        event.preventDefault();
        AddComment({
            variables: {
                text: text,
                taskId: props.task.id
            },
            refetchQueries: [{ query: getComments, variables: {taskId: props.task.id} }]
        });
        setText("")
    }

    const onFocus = () => props.setIsWritingComment(true)
    const onBlur = () => props.setIsWritingComment(false)

    return (
        <div className={style.wrapper}>
            <input className="inputNoBorder-small" autoFocus={true} onFocus={() => onFocus()} onBlur={() => onBlur()} value={text} placeholder={"Add Comment..."} onChange={e => { setText(String(e.target.value)); }}></input>
            <button className="button-small green" onClick={(e) => addCommentQuery(e)}>Add</button>
        </div>
    )
}

export default AddComment;