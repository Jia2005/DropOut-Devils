import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

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
      ? <div>
          <h1>Welcome to the Home Page!</h1>
          <p>This is the landing page after a successful login.</p>
          <button onClick={handleSignOut}>Logout</button>
        </div>
      : <div>
          hello u are unauthorized
        </div>
  );
}

export default HomePage;
