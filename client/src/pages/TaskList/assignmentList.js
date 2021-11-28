import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getCreatedAssignments } from '../../components/queries';

import style from './taskList.module.css'
import Task from './components/task';
import { useHistory } from 'react-router-dom';

function AssignmentList() {

    //Variables
    const history = useHistory();

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
    if(data) console.log(data.createdAssignments)
    //DOM
    if (data) return (
        <div className={style.wrapper}>
            <div className={style.taskListWrapper}>
                {data.createdAssignments.map((task, i) => (
                    <Task task={task} isAssignment={true} index={i + 1} />
                ))}
            </div>
        </div>
    )

    return <div></div>
}

export default AssignmentList;