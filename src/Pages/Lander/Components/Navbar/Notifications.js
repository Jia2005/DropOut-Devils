import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';
import './Notifications.css';

const Notifications = ({onReschedule}) => {
  const [notifications, setNotifications] = useState([]);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDropdown, setShowRejectDropdown] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const rejectionReasons = [
    'Time conflict',
    'Not available',
    'Other'
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserType(userData.type);

            let notificationsQuery;
            if (userData.type === 2) { // Teacher
              notificationsQuery = query(
                collection(db, 'notifications'),
                where('teacherEmail', '==', user.email),
                where('read','==',false),
                where('type','==','meeting_request')
              );
            } else { // Parent
              notificationsQuery = query(
                collection(db, 'notifications'),
                where('Email', '==', user.email),
                where('read','==',false),
                where('type', 'in', ['approval', 'rejection'])
              );
            }

            const notificationsSnapshot = await getDocs(notificationsQuery);
            const notificationsData = notificationsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setNotifications(notificationsData);
          } else {
            console.error("User document not found");
          }
        } else {
          console.error("No user is currently signed in");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const handleApprove = async (notificationId, meetingId) => {
    try {
      await updateDoc(doc(db, 'meetings', meetingId), { requestAccepted: true });
      await deleteDoc(doc(db, 'notifications', notificationId));
      
      const meetingDoc = await getDoc(doc(db, 'meetings', meetingId));
      const meetingData = meetingDoc.data();
      
      await addDoc(collection(db, 'notifications'), {
        Email: meetingData.Email,
        message: `Your meeting request for ${meetingData.date} during ${meetingData.timeSlot} has been approved.`,
        read: false,
        timestamp: new Date(),
        type: 'approval',
      });

      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      alert('Meeting request approved');
    } catch (error) {
      console.error("Error approving meeting: ", error);
      alert('Error approving meeting');
    }
  };

  const handleReject = async (notificationId, meetingId) => {
    if (!rejectReason) {
      alert('Please select a reason for rejection.');
      return;
    }

    try {
      const meetingDoc = await getDoc(doc(db, 'meetings', meetingId));
      const meetingData = meetingDoc.data();

      await addDoc(collection(db, 'notifications'), {
        Email: meetingData.Email,
        message: `Your meeting request for ${meetingData.date} during ${meetingData.timeSlot} has been rejected. Reason: ${rejectReason}`,
        read: false,
        timestamp: new Date(),
        type: 'rejection',
      });

      await deleteDoc(doc(db, 'meetings', meetingId));
      await deleteDoc(doc(db, 'notifications', notificationId));

      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      setShowRejectDropdown(null);
      setRejectReason('');
      alert('Meeting request rejected');
    } catch (error) {
      console.error("Error rejecting meeting: ", error);
      alert('Error rejecting meeting');
    }
  };

  const handleRejectButtonClick = (notificationId) => {
    setShowRejectDropdown(notificationId === showRejectDropdown ? null : notificationId);
  };

  const handleDropdownChange = (e) => {
    setRejectReason(e.target.value);
  };

  const handleNotificationClick = async (notificationId, type, meetingId) => {
    if (type === 'rejection') {
      await handleParentNotificationClick(notificationId, type);
    } else if (type === 'approval') {
      await handleParentNotificationClick(notificationId, type);
    } else if (type === 'meeting_request' && userType === 2) {
      // Handle meeting request click for teachers
      setSelectedNotification(notificationId);
    }
  };

  const handleParentNotificationClick = async (notificationId, type) => {
    try {
      if (type === 'rejection') {
        alert('Your request was rejected due to the provided reason. Please use the Schedule Meeting page to request a new meeting.');
        onReschedule();
      } else if (type === 'approval') {
        alert('Your meeting request has been approved and the meeting has been scheduled.');
      }

      // Delete the notification from Firestore
      await deleteDoc(doc(db, 'notifications', notificationId));

      // Update local state to remove the deleted notification
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error("Error handling notification click:", error);
      alert('An error occurred while handling the notification.');
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map(notification => (
            <li 
              key={notification.id} 
              className="notification-item"
              onClick={() => handleNotificationClick(notification.id, notification.type, notification.meetingId)}
              style={{ cursor: 'pointer' }}
            >
              <p>{notification.message}</p>
              {selectedNotification === notification.id && userType === 2 && notification.type === 'meeting_request' && (
                <div className="notification-actions">
                  <button onClick={() => handleApprove(notification.id, notification.meetingId)}>Approve</button>
                  {showRejectDropdown === notification.id ? (
                    <div className="reject-dropdown">
                      <select
                        value={rejectReason}
                        onChange={handleDropdownChange}
                        onClick={(e) => e.stopPropagation()} // Prevent the dropdown from closing
                      >
                        <option value="" disabled>Select reason for rejection</option>
                        {rejectionReasons.map((reason, index) => (
                          <option key={index} value={reason}>{reason}</option>
                        ))}
                      </select>
                      <button onClick={() => handleReject(notification.id, notification.meetingId)}>Submit Rejection</button>
                    </div>
                  ) : (
                    <button onClick={() => handleRejectButtonClick(notification.id)}>Reject</button>
                  )}
                </div>
              )}
              {userType === 3 && notification.type === 'rejection' && (
                <button onClick={() => handleParentNotificationClick(notification.id, notification.type)}>
                  Reschedule
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
