import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSpring, animated as a } from 'react-spring';
import { Link, useHistory } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';

import style from './../taskList.module.css'

function Task(props) {

    return(
        <div className={style.taskWrapper}>
            <p className={style.taskNum}>{props.index}</p>
            <div className={style.doneWrapper}> 
                <div className={style.doneBg}>

                </div>
            </div>
            <p className={style.taskName}>{props.task.name}</p>
            <button className={style.removeTask} >x</button>
        </div>
    )
}

export default Task;