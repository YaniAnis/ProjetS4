import React , { useState } from 'react';

function Changer(){
const[name , setName] = useState('Guest');
const[quantity , setQuantity] = useState(0);



function handleNameChange(event){
setName(event.target.value);
}
function handleQuantityChange(event){
    setQuantity(event.target.value);
}



return(  <div> <p> name: {name}</p>
<input type="text" value={quantity} onChange={handleQuantityChange} placeholder="Enter quantity"/>
<p> quantity: {quantity}</p>
</div>

)


}
export default Changer ;