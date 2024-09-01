import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Main() {

	const navigate = useNavigate();
  	const auth = getAuth();
	const user = auth.currentUser;

  	useEffect(() => {
		const check = onAuthStateChanged(auth, (user) => {
			if (user) {
			  navigate('/home');
			}
			else {
				navigate('/lander');
			}
		});
  	},[auth]);

	return (
		<>
		
		</>
	);
}

export default Main;