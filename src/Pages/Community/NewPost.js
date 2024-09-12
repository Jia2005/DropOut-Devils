import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); 
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const categories = [
    "General Discussion",
    "Academic Support",
    "Career Guidance",
    "Mental Health and Well-being",
    "Financial Aid Support"
  ];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || user.displayName);
        }
      } else {
        setUser(null);
        setUserName('');
      }
    });
    return () => unsubscribe(); 
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category || !user) return;
    await addDoc(collection(db, "posts"), {
      title,
      content,
      category,
      creator: userName,
      creatorId:user.uid,
      likes: [],
      comments: [],
      createdAt: new Date(),
    });
    setTitle('');
    setContent('');
    setCategory('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a New Post</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder=" Content "
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled>Select Category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};
export default NewPost;