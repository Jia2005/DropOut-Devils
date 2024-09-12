import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faGraduationCap, faBriefcase, faBrain, faMoneyBill, faPlus, faHeart, faCommentDots, faTrash } from '@fortawesome/free-solid-svg-icons';
import NewPost from './NewPost';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Forum.css';

const Forum = () => {
  const categories = [
    { name: "All Posts", icon: faComments },
    { name: "General Discussion", icon: faComments },
    { name: "Academic Support", icon: faGraduationCap },
    { name: "Career Guidance", icon: faBriefcase },
    { name: "Mental Health and Well-being", icon: faBrain },
    { name: "Financial Aid Support", icon: faMoneyBill }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (currentUserId) {
      fetchPosts();
      fetchUsers();
    }
  }, [selectedCategory, currentUserId]);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");
      const postsRef = collection(db, 'posts');
      const querySnapshot = await getDocs(postsRef);
      if (querySnapshot.empty) {
        console.log("No posts found.");
        setPosts([]);
        return;
      }

      const postsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const commentsData = await fetchComments(doc.id);
          return {
            id: doc.id,
            ...postData,
            comments: commentsData
          };
        })
      );
      console.log("Posts fetched successfully:", postsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const querySnapshot = await getDocs(commentsRef);
      const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Fetched comments for post ${postId}:`, commentsData);
      return commentsData;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId) => {
    if (!currentUserId) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();
      const likes = Array.isArray(postData.likes) ? postData.likes : [];

      if (likes.includes(currentUserId)) {
        alert('You have already liked this post');
        return;
      }

      await updateDoc(postRef, { likes: [...likes, currentUserId] });
      console.log(`Post ${postId} liked by ${currentUserId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post');
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (postId, commentId) => {
    if (!currentUserId) return;

    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      const commentDoc = await getDoc(commentRef);
      const commentData = commentDoc.data();
      const likes = Array.isArray(commentData.likes) ? commentData.likes : [];

      if (likes.includes(currentUserId)) {
        alert('You have already liked this comment');
        return;
      }

      await updateDoc(commentRef, { likes: [...likes, currentUserId] });
      console.log(`Comment ${commentId} liked by ${currentUserId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('Failed to like comment');
    }
  };

  // Toggle comments visibility
  const handleToggleComments = (postId) => {
    setCommentsVisible(prev => (prev === postId ? null : postId));
  };

  // Add a new comment to a post
  const handleAddComment = async (postId) => {
    if (!currentUserId || !newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        content: newComment,
        createdAt: new Date(),
        creator: users[currentUserId] || 'Unknown',
        likes: []
      });
      setNewComment('');
      alert('Comment added');
      console.log(`Comment added to post ${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        alert('Post deleted');
        console.log(`Post ${postId} deleted`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  // Delete a comment
  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
        alert('Comment deleted');
        console.log(`Comment ${commentId} deleted from post ${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      }
    }
  };

  return (
    <div className="forum-container">
      <div className="sidebar side">
        <h3>Communities</h3>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              className={selectedCategory === category.name ? "active" : ""}
              onClick={() => setSelectedCategory(category.name)}
            >
              <FontAwesomeIcon className='sign' icon={category.icon} /> {category.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {isCreatingPost ? (
          <NewPost category={selectedCategory} />
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-container">
              <div className="post-header">
                <h4>{post.title}</h4>
                <div className="author">Posted by: {post.creator}</div>
              </div>
              <p>{post.content}</p>
              <div className="post-actions">
                <div className="action-icon-container">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`action-icon ${Array.isArray(post.likes) && post.likes.includes(currentUserId) ? 'liked' : ''}`}
                    onClick={() => handleLikePost(post.id)}
                  />
                  <span>{post.likes.length}</span>
                </div>
                <div className="action-icon-container">
                  <FontAwesomeIcon
                    icon={faCommentDots}
                    className="action-icon"
                    onClick={() => handleToggleComments(post.id)}
                  />
                  <span>{post.comments ? post.comments.length : 0}</span>
                </div>
                {post.userId === currentUserId && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="action-icon"
                    onClick={() => handleDeletePost(post.id)}
                  />
                )}
              </div>
              {commentsVisible === post.id && (
                <div className="comments-section">
                  <textarea
                    style={{height: '70px', width: '95%', padding:'10px', margin:'10px',}}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  /><br></br>
                  <button onClick={() => handleAddComment(post.id)}>Submit</button>
                  {post.comments.map(comment => (
                    <div key={comment.id} className="comment-container">
                      <p><strong>{comment.creator}:</strong> {comment.content}</p>
                      <div className="comment-actions">
                        <div className="action-icon-container">
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`action-icon ${Array.isArray(comment.likes) && comment.likes.includes(currentUserId) ? 'liked' : ''}`}
                            onClick={() => handleLikeComment(post.id, comment.id)}
                          />
                          <span>{comment.likes.length}</span>
                        </div>
                        {comment.userId === currentUserId && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="action-icon"
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <button onClick={() => setIsCreatingPost(true)} className="create-post-button">
          <FontAwesomeIcon icon={faPlus} /> Create New Post
        </button>
      </div>
    </div>
  );
};

export default Forum;
