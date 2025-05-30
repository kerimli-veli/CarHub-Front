import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import getUserFromToken from '../../common/GetUserFromToken';
import Cookies from "js-cookie";


const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userInfo = getUserFromToken();
      try {
        const res = await fetch(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Notification/GetAllNotifications?UserId=${userInfo.id}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");

        const json = await res.json();
        console.log(json);
        const filtered = json.data.filter(item => item.title.startsWith("newUser"));
        console.log(filtered);
        setNotifications(filtered);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setStatusMessage({ type: 'error', text: 'Failed to load notifications.' });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleApprove = async (item) => {
    try {
      const ownerId = item.userId;

      const parts = item.title.split(",");
      const newUserId = parseInt(parts[0].split(":")[1]);
      const carId = parseInt(parts[1].split(":")[1]);

      const payload = { ownerId, newUserId, carId };

      const res = await fetch('https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/CarUserChange', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Approval failed");

      setStatusMessage({ type: 'success', text: 'Approval successful.' });

      // Optionally remove from list
      setNotifications(prev => prev.filter(n => n.id !== item.id));
    } catch (err) {
      console.error("Approval error:", err);
      setStatusMessage({ type: 'error', text: 'Approval failed.' });
    }
  };

  const handleReject = async (id) => {
    const userInfo = getUserFromToken();
        const token = Cookies.get("accessToken");
    try {
      const res = await fetch(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Notification/NotificationRemove?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!res.ok) throw new Error("Rejection failed");

      setStatusMessage({ type: 'success', text: 'Notification successfully removed.' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Rejection error:", err);
      setStatusMessage({ type: 'error', text: 'Failed to remove notification.' });
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading notifications...</div>;

    const finalPrice = localStorage.getItem("finalPrice");

  return (
    <div>
      {statusMessage && (
        <div className={`mb-4 p-3 rounded-md text-white ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {statusMessage.text}
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-gray-500">No new winner notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((item) => (
            <li key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-1">{item.message}</h3>
              <p className="text-gray-700 mb-4">{finalPrice} Azn</p>
              <div className="flex space-x-4">
                <button
                  onClick={async () => {
                    await handleApprove(item);
                    await handleReject(item.id);
                  }}
                  className="flex items-center px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  className="flex items-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Cancel
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
