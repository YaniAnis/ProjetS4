import react , {useState} from 'react';

function MyComponent(){
 const [car , setCar] = useState(
{
    year: 2024,
    make: "ford",
    model: "mustang"
});
function changeYear(event){
    setCar(c => ({...c, year: event.target.value}));
}
function changeMake(event){
    setCar(c => ({...c, make: event.target.value}));
}
function changeModel(event){
    setCar(c => ({...c, model: event.target.value}));
}

    return(
        <div>

<p> Your favorite car is: {car.year} {car.make} {car.model}</p>
<input type='number' value={car.year} onChange={changeYear}/><br/>
<input type='text' value={car.make} onChange={changeMake}/><br/>
<input type='text' value={car.model} onChange={changeModel}/><br/>
</div>
    );
}
export default MyComponent;