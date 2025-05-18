import "./std.css"
import propTypes from 'prop-types'
function Student(props) {
    return(
<div className="std">
  <p>Age: {props.Age}</p>
  <p> validation: {props.validation ? <p> {props.Name}</p> : "ajournée"}</p>
   </div> );
 }
 Student.propTypes = {
Name : propTypes.string,
Age : propTypes.number,
validation : propTypes.bool
 }
 Student.defaultProps = {
    Name: "guest",
    Age : 0,
    validation : false

 }
 export default Student 