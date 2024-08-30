import React, { useState, useEffect } from 'react';
import { storage } from '../../../../firebase'; // Import your Firebase storage setup
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';

function UploadFile() {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    quiz: '',
    file: null,
  });
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Fetch class folders from 'quizzes'
  useEffect(() => {
    const fetchClasses = async () => {
      const quizzesFolderRef = ref(storage, 'quizzes');
      const result = await listAll(quizzesFolderRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  // Fetch quizzes from 'ans' folder within the selected class
  useEffect(() => {
    if (formData.class) {
      const fetchQuizzes = async () => {
        const ansFolderRef = ref(storage, `quizzes/${formData.class}/ans`);
        const result = await listAll(ansFolderRef);
        const quizNames = result.prefixes.map((folder) => folder.name);
        setQuizzes(quizNames);
      };
      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
  }, [formData.class]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.file) {
      // Create a storage reference with the path 'quizzes/class/ans/quiz/filename'
      const storageRef = ref(storage, `quizzes/${formData.class}/ans/${formData.quiz}/${formData.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Track the progress of the upload
        },
        (error) => {
          console.error("File upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            // Reset form data and file input
            setFormData({
              name: '',
              class: '',
              quiz: '',
              file: null,
            });
            document.querySelector('input[type="file"]').value = null;
          });
        }
      );
    }
  };

  return (
    <div className='allform'>
    <form onSubmit={handleSubmit}>
      
      <br />
      <label>
        Class:
        <select name="class" value={formData.class} onChange={handleChange} required>
          <option value="" disabled>Select Class</option>
          {classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Quiz Name:
        <select name="quiz" value={formData.quiz} onChange={handleChange} required>
          <option value="" disabled>Select Quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz} value={quiz}>
              {quiz}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Upload PDF:
        <input type="file" onChange={handleFileChange} accept="application/pdf" required />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
    </div>
  );
}

export default UploadFile;
