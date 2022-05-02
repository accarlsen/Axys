import React from 'react';
import { useQuery } from '@apollo/client';

import { getProject } from '../../components/queries';
import ProjectSimple from './subPages/projectSimple/projectSimple';

function Project() {

    let id = window.location.href.split("/")[window.location.href.split("/").length - 1]
    
    //Queries & mutations
    const {data, loading, error} = useQuery(getProject, {
        variables: {id: id}
    })

    if(data) return (
        <div>
            <ProjectSimple project={data.project} />
        </div>
    )

    return <div></div>
}

export default Project;