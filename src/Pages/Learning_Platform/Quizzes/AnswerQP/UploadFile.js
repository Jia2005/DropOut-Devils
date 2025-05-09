import React, { useState, useEffect } from 'react';
import { storage } from '../../../../firebase'; 
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import './UploadFile.css';

function UploadFile() {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    quiz: '',
    file: null,
  });
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [uploading, setUploading] = useState(false);  // New state for upload status

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
      setUploading(true);  // Set uploading state to true
      const storageRef = ref(storage, `quizzes/${formData.class}/ans/${formData.quiz}/${formData.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optionally handle progress here
        },
        (error) => {
          setUploading(false);  // Reset uploading state on error
          window.alert("File couldn't be uploaded. Please try again.");
          console.error("File upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            window.alert('File uploaded successfully');
            setFormData({
              name: '',
              class: '',
              quiz: '',
              file: null,
            });
            document.querySelector('input[type="file"]').value = null;
            setUploading(false);  // Reset uploading state on success
          });
        }
      );
    }
  };

  return (
    <div className='file-form'>
      <form onSubmit={handleSubmit}>
        <br />
        <label style={{fontSize:'16px', fontWeight:'bold'}}>
          Class:
          <select className='select-file' name="class" value={formData.class} onChange={handleChange} required>
            <option value="" disabled>Select Class</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label style={{fontSize:'16px', fontWeight:'bold'}}>
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
        <label style={{fontSize:'16px', fontWeight:'bold'}}>
          Upload PDF:
          <input type="file" onChange={handleFileChange} accept="application/pdf" required />
        </label>
        <br />
        <button className='button-file' type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default UploadFile;
