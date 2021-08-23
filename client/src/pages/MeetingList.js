import React, {useContext} from 'react';
import { useSpring, animated as a } from 'react-spring';
import './../style/meeting.css';
import './../style/common.css';
import './../style/root.css';
import { getProjects, addMutationTest } from './../components/queries';
import { AuthContext } from './../context/auth-context';

import { gql, useQuery } from '@apollo/client';

function MeetingList() {
    const context = useContext(AuthContext);

    const fadeInAnimation = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })


    const { loading, error, data } = useQuery(getProjects);

    const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })
    const hoverOn = useSpring({ backgroundColor: "#3AAFA9", to: { backgroundColor: "#289692" } });
    const hoverOff = useSpring({ backgroundColor: "#289692", to: { backgroundColor: "#3AAFA9" } });

    if (loading) return <span>Loading...</span>
    if (error) console.log("error: ", error);

    if (data) return (
        <a.div className="meetlist-wrapper" style={fadeInAnimation}>
            <br/>
            <span className="meetlist-title">Your Tournaments</span>
            {/*data.projects.map(data => (
                <MeetingListing id={data.id} name={data.name} date={data.time} winner={data.winnerId} />
            ))*/}
            <br></br>
        </a.div>
    );
    return(
        <div></div>
    )
}

export default MeetingList;