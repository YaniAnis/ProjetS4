import react , {useState} from 'react';

function ArrayList (){
const[cars , setCars] = useState([]);
const[carYear , setCarYear] = useState(new Date().getFullYear());
const[carMake , setCarMake] = useState("");
const[carModel , setCarModel] = useState("");

function addCar(){
    const newCar = {year: carYear,
        make: carMake,
        model: carModel};

setCars (c=> [...c , newCar]);
setCarYear(new Date().getFullYear());
setCarMake("");
setCarModel("");
    }
function removeCar(index) {
    setCars(c=> c.filter((_,i)=> i !== index));
}
function changeYear(event) {
setCarYear(event.target.value);}
function changeMake(event) {
    setCarMake(event.target.value);}
function changeModel(event) {
    setCarModel(event.target.value);}

return (
<div>
        <h1>
         Car List : 
         </h1>
         <ul>
             {cars.map((car, index) => 
            <li key={index} onClick= { ()=> removeCar(index)}>
             {car.year} {car.make} {car.model}
            </li>  )}
         </ul>
         <div>
    <input type="number" value={carYear} onChange={changeYear} /><br/>
    <input type="text" value={carMake} onChange={changeMake} placeholder='enter the brand of the car '/><br/>
    <input type="text" value={carModel} onChange={changeModel}  placeholder='enter the model'/><br/>
    <button onClick={addCar}>add a car </button>
    </div>
</div>



 );}
export default ArrayList;