import React, { useEffect, useState } from 'react';
import { collection, getDocs,getDoc , query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Posts = ({ category }) => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      let q;
      if (category === "All Posts") {
        q = query(collection(db, "posts"));
      } else {
        q = query(collection(db, "posts"), where("category", "==", category));
      }

      try {
        const querySnapshot = await getDocs(q);
        const postsArray = [];
        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() });
        });
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, [category]);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  const handleLike = async (postId, likes) => {
    if (currentUser && !likes.includes(currentUser.uid)) {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: [...likes, currentUser.uid]
      });
    }
  };

  const addComment = async (postId, comment) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    const comments = postSnap.data().comments || [];
    await updateDoc(postRef, {
      comments: [...comments, { user: currentUser.displayName, comment }]
    });
  };

  return (
    <div>
      <h3>{category}</h3>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', margin: '20px 0', padding: '10px' }}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
          <p><strong>Posted by:</strong> {post.creator}</p>
          <p><strong>Likes:</strong> {post.likes.length}</p>
          <button onClick={() => handleLike(post.id, post.likes)}>Like</button>

          {/* Comments Section */}
          <div>
            <h5>Comments</h5>
            {post.comments && post.comments.map((comment, index) => (
              <p key={index}><strong>{comment.user}:</strong> {comment.comment}</p>
            ))}
            <form onSubmit={(e) => {
              e.preventDefault();
              addComment(post.id, e.target.comment.value);
              e.target.comment.value = '';
            }}>
              <input type="text" name="comment" placeholder="Add a comment..." />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
