import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import style from './../taskList.module.css'
import { addComment, deleteTask, getComments, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';

function CommentList(props) {

    //Queries & mutations
    const { loading, error, data } = useQuery(getComments, {
        variables: { taskId: props.task.id }
    });

    const [AddComment, { errorC }] = useMutation(addComment, {
        variables: { text: "comment", taskId: props.task.id }
    })

    /*
    author{
        id
        fname
        lname
        name
        email
      }
    */
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

    if (data && props.showComments) {
        if (data.comments.length > 0) {
            return (
                <div key={props.index} className={` `}>
                    {data.comments.map((comment) => (
                        <div className={style.commentWrapper}>
                            <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                            <p className="ps">{comment.text}</p>
                        </div>
                    ))}

                </div>
            )
        } else {
            return (
                <div key={props.index} className={` ${style.taskWrapper}`}>
                    <span>New Comment</span>

                </div>
            )
        }
    }
    return (<div></div>)
}

export default CommentList;