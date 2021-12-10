import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { getTasks, taskDone, deleteTask, taskAccepted, taskIgnored, addComment } from '../../../components/queries';

import style from './../taskList.module.css'

function PlanDay(props) {

    //Methods
    const cancel = () => {
        props.setIsPlanning(false); props.setPlannedTasks([])
    }

    //DOM
    if (props.isPlanning) {
        return (
            <div className={style.PDWrapper}>
                <div className={style.STInner}>
                    <div className={style.PDGrid}>
                        <button className="button-small grey" onClick={() => cancel()}>Cancel</button>
                        <button className="button-small green">Add Daily Goals</button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={style.STPreview} onClick={() => props.setIsPlanning(true)}>
            <button className="button grey" >{"Plan Day >"}</button>
        </div>
    )
}

export default PlanDay;