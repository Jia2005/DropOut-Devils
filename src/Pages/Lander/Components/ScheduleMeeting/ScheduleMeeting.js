import React, { useState } from 'react';
import './ScheduleMeeting.css';

const ScheduleMeeting = () => {
  const [role, setRole] = useState('parent');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(''); // State for time slot

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You will hear shortly about your request for meeting on ${date} during ${timeSlot}`);
  };

  return (
    <div className="schedule-meeting-container">
      <h2>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Preferred Date:</label>
          <input
            className='date'
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeSlot">Preferred Time Slot:</label>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="" disabled>Select a time slot</option>
            <option value="9:00-11:00">9:00-11:00</option>
            <option value="12:00-15:00">12:00-15:00</option>
            <option value="16:00-19:00">16:00-19:00</option>
          </select>
        </div>
        <button type="submit" className='meeting'>Request for a Meeting</button>
      </form>
    </div>
  );
};

export default ScheduleMeeting;
