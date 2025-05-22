import React from "react";
import ReactDOM from "react-dom";
import profilepic from "./images.jpg";
import "./card.css";
 
function Card() {
    return(
<div className="Card1">
    <h1> Abdnr bdr</h1>
    <img className="imgcard" src={profilepic} alt="profilepic"/>
    <p> This is a card that introduces me </p> 
</div>
        
    );
}
 export default Card ;