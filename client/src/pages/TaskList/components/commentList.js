import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import style from './../taskList.module.css'
import { addComment, commentLiked, deleteComment, deleteTask, getComments, getTasks } from '../../../components/queries';
import { Link } from 'react-router-dom';
import AddComment from '../../../components/AddComment/AddComment';
import LikeIcon from './../assets/LikeIcon.svg'
import LikedIcon from './../assets/LikedIcon.svg'


function CommentList(props) {

    const id = localStorage.getItem("personId");

    //Queries & mutations
    const { loading, error, data } = useQuery(getComments, {
        variables: { taskId: props.task.id }
    });

    const [CommentLiked, { errorC }] = useMutation(commentLiked)

    const [DeleteComment, { errorD }] = useMutation(deleteComment)

    //Methods
    const commentLikedQuery = (event, id) => {
        event.preventDefault();
        CommentLiked({
            variables: {
                id: id,
            },
            refetchQueries: [{ query: getComments, variables: { taskId: props.task.id } }]
        });
    }

    const deleteCommentQuery = (event, id) => {
        event.preventDefault();
        DeleteComment({
            variables: {
                id: id,
            },
            refetchQueries: [{ query: getComments, variables: { taskId: props.task.id } }]
        })
    }

    const likesToString = (likesArray) => {
        let string = ""
        if (likesArray.length > 1) {
            for (let i = 0; i < likesArray.length - 1; i++) {
                string += likesArray[i].name
                if(likesArray.length > 2 && i < likesArray.length - 2){
                    string += ", "
                }
                if(i === likesArray.length - 2){
                    string += " & "
                }
            }
        }
        string += likesArray[likesArray.length-1].name
        return string
    }

    //Render
    if (data && props.showComments) {
        if (data.comments.length > 0) {
            return (
                <div key={props.index} className={` `}>
                    {data.comments.map((comment) => (
                        <div key={comment.id} className={style.commentWrapper}>
                            <img className={style.profilePicture} src={"http://totallyhistory.com/wp-content/uploads/2013/10/Daniel-Kahneman.jpg"} />
                            <p className="ps">{comment.text}</p>
                            <div>
                                {comment.likers.length > 0 ?
                                    <button className={style.likeWrapper} onClick={(e) => commentLikedQuery(e, comment.id)}>
                                        <span>{comment.likers.length}</span>
                                        {comment.likes.includes(id) ?
                                            <img className={style.likeIcon} src={LikedIcon} alt={"Un-like"} />
                                            :
                                            <img className={style.likeIcon} src={LikeIcon} alt={"Like"} />
                                        }
                                        <span className={style.likersList}>{likesToString(comment.likers)}</span>
                                    </button>
                                    :
                                    <button className={style.likeWrapper} onClick={(e) => commentLikedQuery(e, comment.id)}>
                                        <span>{" "}</span>
                                        {comment.likes.includes(id) ?
                                            <img className={style.likeIcon} src={LikedIcon} alt={"Un-like"} />
                                            :
                                            <img className={style.likeIcon} src={LikeIcon} alt={"Like"} />
                                        }
                                    </button>
                                }
                            </div>
                            {comment.authorId === id ? <button className={style.removeComment} onClick={(e) => deleteCommentQuery(e, comment.id)}>X</button> : <span></span>}
                        </div>
                    ))}
                    <AddComment task={props.task} isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment} />
                </div>
            )
        } else {
            return (
                <div className={` `}>
                    <AddComment task={props.task} isWritingComment={props.isWritingComment} setIsWritingComment={props.setIsWritingComment} />
                </div>
            )
        }
    }
    return (<div></div>)
}

export default CommentList;