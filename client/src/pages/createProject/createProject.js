import React, { useState } from 'react';
import Textarea from '../../components/Textarea';
import style from './createProject.module.css';

function CreateProject() {

    //States
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")


    //Render
    return (
        <div className={style.outerWrapper}>
            <div className={style.topBar}>
            </div>
            <div className={style.wrapper}>
                <div className={style.card}>
                    <h1 className="h3">Create a new project</h1>
                    <div className={style.inputGrid}>
                        <label className="p">Name</label>
                        <input className="input" onChange={e => { setName(String(e.target.value)); }} value={name}></input>
                    </div>
                    <div className={style.inputGrid}>
                        <label className="p">Description</label>
                        <Textarea state={description} setState={setDescription} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProject;