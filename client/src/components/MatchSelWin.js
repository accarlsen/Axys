import React, { useState, useEffect, useContext } from 'react';
import './../style/navbar.css';
import { Link } from "react-router-dom";
import { useSpring, animated as a } from 'react-spring';
import { AuthContext } from './../context/auth-context';

import { gql, useQuery, useMutation } from '@apollo/client';
import { selectWinner } from './../components/queries';

function MatchSelWin(props) {

    const [id, setId] = useState(props.data.id);
    const [winner, setWinner] = useState("");
    const [winnerP, setWinnerP] = useState("");
    const [loser, setLoser] = useState("");
    const [loserP, setLoserP] = useState("");

    const [SelectWinner, { error1 }] = useMutation(selectWinner, {
        errorPolicy: 'all'
    })
    if (error1) {
        console.log(error1.message);
        return (
            <span className="error-message-text">{error1.message}</span>
        )
    };

    if (props.data) {
        return (
            <div className="matchselwin-wrapper">
                <span className="meetlisting-text">{props.data.name}</span>
                <span className="meetlisting-text1">{"Select winner: "}</span>
                <button className="create-task-button" onClick={e => {
                    console.log(props.data.fighter1.id);
                    console.log(props.data.fighter2.id);
                    setWinner(props.data.fighter1.id);
                    setLoser(props.data.fighter2.id);

                    console.log(props.data.fighter1.person.id);
                    console.log(props.data.fighter2.person.id);
                    setWinnerP(props.data.fighter1.person.id);
                    setLoserP(props.data.fighter2.person.id);

                    const Winner = props.data.fighter1.id;
                    const Loser = props.data.fighter2.id;
                    const WinnerP = props.data.fighter1.person.id;
                    const LoserP = props.data.fighter2.person.id;

                    e.preventDefault();
                    SelectWinner({
                        variables: {
                            id: id,
                            winner: Winner,
                            winnerP: WinnerP,
                            loser: Loser,
                            loserP: LoserP
                        }
                    })
                }}>{props.data.fighter1.person.fname}</button>
                <button className="create-task-button" onClick={e => {
                    console.log(props.data.fighter2.id);
                    console.log(props.data.fighter1.id);
                    setWinner(props.data.fighter2.id);
                    setLoser(props.data.fighter1.id);

                    console.log(props.data.fighter2.person.id);
                    console.log(props.data.fighter1.person.id);
                    setWinnerP(props.data.fighter2.person.id);
                    setLoserP(props.data.fighter1.person.id);

                    const Winner = props.data.fighter2.id;
                    const Loser = props.data.fighter1.id;
                    const WinnerP = props.data.fighter2.person.id;
                    const LoserP = props.data.fighter1.person.id;

                    e.preventDefault();
                    SelectWinner({
                        variables: {
                            id: id,
                            winner: Winner,
                            winnerP: WinnerP,
                            loser: Loser,
                            loserP: LoserP
                        }
                    })
                }}>{props.data.fighter2.person.fname}</button>
            </div>
        )
    }
    return (<div></div>)
}

export default MatchSelWin;