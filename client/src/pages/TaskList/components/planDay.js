import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { getProgress, getTasks, planTasks } from '../../../components/queries';

import style from './../taskList.module.css'

function PlanDay(props) {

    //Queries
    const [TaskPlanned, { error }] = useMutation(planTasks, {
        variables: props.plannedTasks
    })

    const { loading: loadingP, error: errorP, data: dataP} = useQuery(getProgress)


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
            refetchQueries: [{ query: getTasks }, {query: getProgress}]
        })
        cancel();
    }

    const numCompletedPlannedTasks = () => {
        let numCompleted = 0;
        props.plannedTasksData.map((task) => {
            if (task.done) numCompleted++;
        })
        return numCompleted
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
    else {
        if (dataP && dataP.progress.amntPlanned > 0) return (
            <div className={style.PDWrapper} onClick={() => props.setIsPlanning(true)}>
                <button className="button grey" >{"Daily Tasks: " + dataP.progress.amntDone + "/" + dataP.progress.amntPlanned}</button>
            </div>
        )
        else return (
            <div className={style.PDWrapper} onClick={() => props.setIsPlanning(true)}>
                <button className="button grey" >{"Plan Day >"}</button>
            </div>
        )
    }
}

export default PlanDay;