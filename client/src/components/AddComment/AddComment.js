import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import style from './addComment.module.css'
import { addComment, getComments } from '../queries';
import Textarea from '../Textarea';

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
            refetchQueries: [{ query: getComments, variables: { taskId: props.task.id } }]
        });
        setText("")
    }

    function auto_grow(e) {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    const onFocus = () => props.setIsWritingComment(true)
    const onBlur = () => props.setIsWritingComment(false)

    //Keyboard input handler
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addCommentQuery(event);
        }
    }

    return (
        <div className={style.wrapper} onKeyDown={handleKeyDown}>
            {/*<input className="inputNoBorder-small" autoFocus={true} onFocus={() => onFocus()} onBlur={() => onBlur()} value={text} placeholder={"Add Comment..."} onChange={e => { setText(String(e.target.value)); }}></input>*/}
            <textarea
                className="input textarea"
                onChange={e => { setText(String(e.target.value)); }}
                value={text}
                onInput={(e) => { auto_grow(e) }}
                autoFocus={true} 
                onFocus={() => onFocus()} 
                onBlur={() => onBlur()}
                placeholder={"Add Comment..."}
            >
            </textarea>
            <div>
                <button className="button-small green" onClick={(e) => addCommentQuery(e)}>Add</button>
            </div>
        </div>
    )
}

export default AddComment;