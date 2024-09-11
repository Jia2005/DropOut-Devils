import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faGraduationCap, faBriefcase, faBrain, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';
import Posts from './Posts';
import NewPost from './NewPost';
import './Forum.css';  // Assuming you have the Forum.css for styling

const Forum = () => {
  const categories = [
    { name: "All Posts", icon: faComments },
    { name: "General Discussion", icon: faComments },
    { name: "Academic Support", icon: faGraduationCap },
    { name: "Career Guidance", icon: faBriefcase },
    { name: "Mental Health and Well-being", icon: faBrain },
    { name: "Financial Aid Support", icon: faMoneyBill }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Posts"); // Default to "All Posts"
  const [isCreatingPost, setIsCreatingPost] = useState(false); // State to toggle between posts and new post form

  const handleCreatePostClick = () => {
    setIsCreatingPost(true); // Switch to NewPost component
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
          <NewPost category={selectedCategory} /> // Show NewPost component
        ) : (
          <Posts category={selectedCategory} /> // Show Posts component
        )}
      </div>
      
      <div className="create">
        <button className="creation" onClick={handleCreatePostClick}>
          <FontAwesomeIcon icon={faPlus} /> Create new post
        </button>
      </div>
    </div>
  );
};

export default Forum;

