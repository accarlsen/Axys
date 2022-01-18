import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { addProject, getProjects } from '../../components/queries';
import Textarea from '../../components/Textarea';
import style from './createProject.module.css';

function CreateProject() {

    //States
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [privateB, setPrivateB] = useState(false)
    const [requireAdmin, setRequireAdmin] = useState(false)

    //Mutations
    const [AddProject, { error }] = useMutation(addProject, {
        variables: { name, description, privateB, requireAdmin }
    }) 

    //Methods
    const addProjectQuery = (event) => { 
        event.preventDefault(); //Enable custom behaviour
        AddProject({
            variables: {
                name: name,
                description: description,
                simplifiedTasks: true,
                inviteRequired: privateB,
                inviteAdminExclusive: requireAdmin
            },
            //refetchQueries: [{ query: getProjects }]
        });
        setName("");
        setDescription("");
    }

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
                    <div className={style.checkboxWrapper} onClick={() => {privateB ? setPrivateB(false) : setPrivateB(true)}}>
                        <span className={`${style.doneButton}`} >
                            {privateB && <svg className={style.doneCheckmark} viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="#25D195" strokeWidth="35" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                            </svg>}
                        </span>
                        <label className="p">Private</label>
                    </div>
                    <div className={style.checkboxWrapper} onClick={() => {requireAdmin ? setRequireAdmin(false) : setRequireAdmin(true)}}>
                        <span className={`${style.doneButton}`} >
                            {requireAdmin && <svg className={style.doneCheckmark} viewBox="0 0 289 192" preserveAspectRatio="xMidYMid" width="289" height="192" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="#25D195" strokeWidth="35" d="M10.6066 61.3934L129.116 179.903M108.393 180.458L277.458 11.3934" />
                            </svg>}
                        </span>
                        <label className="p">Only admins can invite</label>
                    </div>
                    <button className={`button green ${style.bottomMargin}`} onClick={(e) => addProjectQuery(e)} >Create</button>
                </div>
            </div>
        </div>
    )
}

export default CreateProject;