import React from 'react';
import { getAuth, signOut } from "firebase/auth";

function signOutHome() {
  const auth = getAuth();
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    alert('There are some server issues');
  });
}

function HomePage() {

  const auth = getAuth();
  const user = auth.currentUser;

  return (
    user
    ? <div>
      <h1>Welcome to the Home Page!</h1>
      <p>This is the landing page after a successful login.</p>
      <button onClick={signOutHome}>Logout</button>
    </div>
    : <div>
      Hello u are unauthorized
    </div>
  );
}

export default HomePage;
