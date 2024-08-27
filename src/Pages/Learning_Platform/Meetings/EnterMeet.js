import React,  {useState} from "react";
import './HomePage.css'
import { useNavigate } from "react-router-dom";
const EnterMeet = () =>{
    const [roomCode, setroomCode] = useState('')
    const Navigate = useNavigate();
    const handleFormSubmit = (ev) => {
        ev.preventDefault();
        Navigate(`/room/${roomCode}`)

        
    }

    return(
    
    <div className = 'home-page'>
        <form onSubmit={handleFormSubmit} className='form'>
            <div>
                <label>Enter Room Code: </label>
                <input 
                type='text' 
                value = {roomCode} 
                onChange={(e)=> setroomCode(e.target.value) } 
                required
                 placeholder="Enter Room Code"/>
                
            </div>
            <button type='submit'> Enter room</button>
        </form>

    </div>)
}

export default EnterMeet