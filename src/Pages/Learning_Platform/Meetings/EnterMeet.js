import React, { useState } from "react";
import './HomePage.css';
import { useNavigate } from "react-router-dom";

const EnterMeet = () => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = (ev) => {
        ev.preventDefault();
        navigate(`/room/${roomCode}`);
    };

    const roomOptions = [
       "1st","2nd","3rd","4th","5th","6th",
       "7th","8th","9th","10th","11th","12th"
    ];

    return (
        <div className='enter-meet'>
            <form onSubmit={handleFormSubmit} className='meet-form'>
                <div>
                    <label style={{fontSize:'16px', color:'black', fontWeight: "bold"}}>Select Class </label>
                    <select 
                        value={roomCode} 
                        onChange={(e) => setRoomCode(e.target.value)} 
                        required
                    >
                        <option value="" disabled></option>
                        {roomOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div><br></br>
                <button className="meet-button" type='submit'>Enter room</button>
            </form>
        </div>
    );
}

export default EnterMeet;
