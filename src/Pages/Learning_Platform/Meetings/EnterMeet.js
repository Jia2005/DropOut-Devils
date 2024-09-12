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
        "1A", "1B", "1C", "1D",
        "2A", "2B", "2C", "2D",
        "3A", "3B", "3C", "3D",
        "4A", "4B", "4C", "4D",
        "5A", "5B", "5C", "5D",
        "6A", "6B", "6C", "6D",
        "7A", "7B", "7C", "7D",
        "8A", "8B", "8C", "8D",
        "9A", "9B", "9C", "9D",
        "10A", "10B", "10C", "10D"
    ];

    return (
        <div className='enter-meet'>
            <form onSubmit={handleFormSubmit} className='meet-form'>
                <div>
                    <label style={{fontSize:'16px', color:'#0039f1'}}>Select Class </label>
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
