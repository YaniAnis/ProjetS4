import React, {useState} from "react";
import "./clr.css";
function ColorPickerApp () {

const [color, setColor] = useState('red');
function handleColorChange(event){
setColor(event.target.value);
}

    return( <div className="clr-cont">

<h1> Color Picker </h1>
<div className="clr-display" style={{backgroundColor:color}}>
<p> Selected Color: {color} </p>
</div>
<label>slect a color:</label>
<input type="color" value={color} onChange={handleColorChange}/>
 </div>
 );}
export default ColorPickerApp;