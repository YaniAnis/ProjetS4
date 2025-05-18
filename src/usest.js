import React , {useState} from 'react';

function Travail() {
     const[name,setName]=useState("Guest");
     const[age, setAge]=useState(0);
     const[isEmployed,setIsEmployed]=useState(false);

const updateName =() => {
    setName("John");
}
const incrementAge = () => {
    setAge(age+1);
}
const employedState =() => {
    setIsEmployed(!isEmployed);
}
    return(
        <div className="travail">
          <p>name:{name}</p>
          <button onClick={updateName}>change name</button>
          <p>age:{age}</p>
          <button onClick={incrementAge}>increment age</button>
          <p>isemployed:{isEmployed ? "yes" : "no"} </p>
          <button onClick={employedState}>change state</button>
        </div>
    )
}
export default Travail;