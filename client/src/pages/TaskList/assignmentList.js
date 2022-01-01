import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getCreatedAssignments } from '../../components/queries';

import style from './taskList.module.css'
import Task from './components/task';
import { useHistory } from 'react-router-dom';
import Assignment from './components/assignment';

function AssignmentList() {

    //Variables
    const history = useHistory();
    const [isWritingComment, setIsWritingComment] = useState(false)

    //Queries
    const { loading, error, data } = useQuery(getCreatedAssignments);

    //Methods
    const routeChange = () => {
        history.push("/login")
    }

    if (loading) return <span>Loading...</span>
    if (error) {
        console.log(error.message);
        if (error.message === 'Unauthenticated user') {
            localStorage.setItem('admin', false);
            localStorage.removeItem('token');
            routeChange();
        }
    }
    if (data) console.log(data.createdAssignments)
    //DOM
    if (data) return (
        <div className={style.wrapper}>
            <div className={style.topBar}></div>

            <div className={style.innerWrapper}>
                <div className={style.taskListWrapper}>
                    <div className={style.titleWrapper}>
                        <h1 className="h4">Created assignments</h1>
                    </div>
                    {data.createdAssignments.map((task, i) => (
                        <Assignment task={task} isAssignment={true} index={i + 1} isWritingComment={isWritingComment} setIsWritingComment={setIsWritingComment} />
                    ))}
                </div>
            </div>
        </div>
    )

    return <div></div>
}

export default AssignmentList;