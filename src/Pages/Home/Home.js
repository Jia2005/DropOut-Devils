import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import ErrorPage from './Unauth';
import Lander from '../Lander/Lander';

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      window.location.href = '/login';
    }).catch((error) => {
      alert('There are some server issues');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    user
      ? <Lander/>
      : <ErrorPage/>
  );
}

export default HomePage;
