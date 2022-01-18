import React, { useState } from 'react';

function Textarea(props) {

    function auto_grow(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    //Render
    return (
        <textarea
            className="input textarea"
            onChange={e => { props.setState(String(e.target.value)); }}
            value={props.state}
            onInput={(e) => { auto_grow(e) }}
        >
        </textarea>
    )
}

export default Textarea;