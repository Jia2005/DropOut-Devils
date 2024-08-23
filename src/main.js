import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function Main() {

	const navigate = useNavigate();
  	const auth = getAuth();
	const user = auth.currentUser;

  	useEffect(() => {
  	    if (user) {
  	      navigate('/home');
  	    } else {
  	      navigate('/login');
  	    }
  	},[]);

	return (
		<>
		
		</>
	);
}

export default Main;