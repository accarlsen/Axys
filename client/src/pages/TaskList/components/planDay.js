import React from 'react';
import { useMutation } from '@apollo/client';
import { getTasks, taskPlanned } from '../../../components/queries';

import style from './../taskList.module.css'

function PlanDay(props) {

    //Queries
    const [TaskPlanned, {error}] = useMutation(taskPlanned, {
        variables: props.plannedTasks
    })

    //Methods
    const cancel = () => {
        props.setIsPlanning(false); props.setPlannedTasks([])
    }

    const taskPlannedQuery = (event) => {
        event.preventDefault();
        TaskPlanned({
            variables: {
                id: props.plannedTasks
            },
            refetchQueries: [{ query: getTasks }]
        })
        cancel();
    }

    //DOM
    if (props.isPlanning) {
        return (
            <div className={style.PDWrapper}>
                <div className={style.STInner}>
                    <div className={style.PDGrid}>
                        <button className="button-small grey" onClick={() => cancel()}>Cancel</button>
                        <button className="button-small green" onClick={(e) => taskPlannedQuery(e)}>Add Daily Goals</button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={style.PDWrapper} onClick={() => props.setIsPlanning(true)}>
            <button className="button grey" >{"Plan Day >"}</button>
        </div>
    )
}

export default PlanDay;