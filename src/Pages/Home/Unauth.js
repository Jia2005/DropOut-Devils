import React from "react";

const ErrorPage = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      textAlign: "center",
      flexDirection: "column",
      color: "#333",
    },
    icon: {
      fontSize: "80px",
      marginBottom: "20px",
      color: "#d9534f",
    },
    heading: {
      fontSize: "36px",
      marginBottom: "10px",
      fontWeight: "700",
      color: "#333",
    },
    message: {
      fontSize: "18px",
      color: "#555",
    },
    homeButton: {
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>🚫</div>
      <h1 className="heading" style={styles.heading}>
        Error: Unauthorized Access
      </h1>
      <p style={styles.message}>
        You do not have permission to view this page. Please contact your
        administrator if you believe this is an error.
      </p>
      <a href="/" style={styles.homeButton}>
        Go to Login
      </a>
    </div>
  );
};

export default ErrorPage;
