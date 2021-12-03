import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import style from './../taskList.module.css'
import { addComment, deleteTask, getComments, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';
import AddComment from '../../../components/AddComment/AddComment';

function CommentList(props) {

    //Queries & mutations
    const { loading, error, data } = useQuery(getComments, {
        variables: { taskId: props.task.id }
    });

    //Render
    if (data && props.showComments) {
        if (data.comments.length > 0) {
            return (
                <div key={props.index} className={` `}>
                    {data.comments.map((comment) => (
                        <div key={comment.id} className={style.commentWrapper}>
                            <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                            <p className="ps">{comment.text}</p>
                        </div>
                    ))}
                    <AddComment task={props.task} isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment} />
                </div>
            )
        } else {
            return (
                <div className={` `}>
                    <AddComment task={props.task}  isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment}/>
                </div>
            )
        }
    }
    return (<div></div>)
}

export default CommentList;