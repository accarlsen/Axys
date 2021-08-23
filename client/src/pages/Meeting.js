import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated as a } from 'react-spring';
import { Link, useHistory } from "react-router-dom";
import './../style/meeting.css';
import './../style/common.css';
import './../style/root.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import { getFighters, addMutationTest } from './../components/queries';
import Leaderboard from '../components/Leaderboard.js';


function Meeting() {
  const [page, setPage] = useState(Number(0));

  useEffect(
    () => {
    }, [page]
  );

  const loc = window.location.href.split('/')[window.location.href.split('/').length - 1];

  const fadeInAnimation = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })

  let admin = false;
  if(localStorage.getItem('admin') !== "null"){
    admin = true;
  }

  

  const { loading, error, data } = useQuery(getFighters,
    { variables: { projectId: loc } });

  if (loading) return <span>Loading...</span>
  if (error) console.log(error)

  if (page === Number(0)) {
    return (
      <a.div className="meeting-wrapper" style={fadeInAnimation}>
        <div className="meeting-navbar">
          <button className="meeting-navbar-button meeting-navbar-button-selected" onClick={() => { setPage(0) }}><Link className="meeting-navbar-link" to={"/tournament/leaderboard/" + loc}>Leaderboard</Link></button>
          <button className="meeting-navbar-button" onClick={() => { setPage(1) }}><Link className="meeting-navbar-link" to={"/tournament/matches/" + loc}>Matches</Link></button>
          <button className="meeting-navbar-button" onClick={() => { setPage(2) }}><Link className="meeting-navbar-link" to={"/tournament/participants/" + loc}>Participants</Link></button>
        </div>

        <Leaderboard data={data}></Leaderboard>

      </a.div>
    )
  }

  if (page === Number(1)) {
    return (
      <a.div className="meeting-wrapper" style={fadeInAnimation}>
        <div className="meeting-navbar">
        <button className="meeting-navbar-button " onClick={() => { setPage(0) }}><Link className="meeting-navbar-link" to={"/tournament/leaderboard/" + loc}>Leaderboard</Link></button>
          <button className="meeting-navbar-button meeting-navbar-button-selected" onClick={() => { setPage(1) }}><Link className="meeting-navbar-link" to={"/tournament/matches/" + loc}>Matches</Link></button>
          <button className="meeting-navbar-button" onClick={() => { setPage(2) }}><Link className="meeting-navbar-link" to={"/tournament/participants/" + loc}>Participants</Link></button>
        </div>
{/*}
        {admin && <CreateMatch projectId={loc}></CreateMatch>}
        <MatchList></MatchList>
    */}
      </a.div>
    )
  }

  if (page === Number(2)) {
    return (
      <a.div className="meeting-wrapper" style={fadeInAnimation}>
        <div className="meeting-navbar">
        <button className="meeting-navbar-button" onClick={() => { setPage(0) }}><Link className="meeting-navbar-link" to={"/tournament/leaderboard/" + loc}>Leaderboard</Link></button>
          <button className="meeting-navbar-button" onClick={() => { setPage(1) }}><Link className="meeting-navbar-link" to={"/tournament/matches/" + loc}>Matches</Link></button>
          <button className="meeting-navbar-button meeting-navbar-button-selected" onClick={() => { setPage(2) }}><Link className="meeting-navbar-link" to={"/tournament/participants/" + loc}>Participants</Link></button>
        </div>
{/*}
        {admin && <CreateFighter projectId={loc}></CreateFighter>}
        <FighterList></FighterList>
        */}
    </a.div>
    )
  }

  return (
    <div></div>
  )
}

export default Meeting;