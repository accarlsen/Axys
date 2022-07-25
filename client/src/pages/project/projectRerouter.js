import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ProjectRerouter() {

    let id = window.location.href.split("/")[window.location.href.split("/").length - 1]
    const history = useHistory();

    useEffect(() => {
        history.push(`/project/${id}`);

    }, [])

    return <div></div>
}

export default ProjectRerouter;