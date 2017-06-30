import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Pusher from "pusher-js";

const baseUrl = "http://localhost:50811";

const Welcome = ({ onSubmit }) => {
    let usernameInput;
    return (
        <div>
            <p>Enter your Twitter name and start chatting!</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(usernameInput.value);
            }}>
                <input type="text" placeholder="Enter Twitter handle here" ref={node => {
                    usernameInput = node;
                }}/>
                <input type="submit" value="Join the chat" />
            </form>
        </div>
    );
};

