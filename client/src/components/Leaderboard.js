import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSpring, animated as a } from 'react-spring';
import { gql, useQuery, useMutation } from '@apollo/client';
import './../style/leaderboard.css';

function Leaderboard(props) {

    if (props.data) {
        const sortedData = props.data.fighters.slice().sort((a, b) => (a.wins < b.wins) ? 1 : -1);
        let largestNum = 0;
        if (sortedData.length > 0) {
            largestNum = Math.ceil(sortedData[0].wins / 5) * 5;
        }

        return (
            <div className="leaderboard-wrapper">
                {sortedData.map(data => {
                    return (
                        <LeaderboardBar data={data} largestNum={largestNum}></LeaderboardBar>
                    )
                })}
                <span className="leaderboard-xtext">{largestNum}</span>
            </div>
        )
    }
    else {
        return (
            <div></div>
        )
    }
}

export default Leaderboard;

function LeaderboardBar(props) {
    const [toWidth, setToWidth] = useState(String((props.data.wins / props.largestNum) * 100) + '%');
    const animatePasswordStrength = useSpring({ to: { width: toWidth }, from: { width: '0%' } });

    return (
        <div className="leaderboard-bar">
            <span className="leaderboard-ytext">{props.data.person.fname}</span>
            <div className="leaderboard-bar-div-wrapper">
                <a.div className="leaderboard-bar-div" style={animatePasswordStrength}></a.div>
            </div>
        </div>
    )
}