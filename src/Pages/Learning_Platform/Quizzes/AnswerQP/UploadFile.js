import React, { useState, useEffect } from 'react';
import { storage } from '../../../../firebase'; 
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

  useEffect(() => {
    const fetchClasses = async () => {
      const quizzesFolderRef = ref(storage, 'quizzes');
      const result = await listAll(quizzesFolderRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

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
      const storageRef = ref(storage, `quizzes/${formData.class}/ans/${formData.quiz}/${formData.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => {
          console.error("File upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
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
  );
}

export default UploadFile;
