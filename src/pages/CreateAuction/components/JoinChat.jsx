import React, { useEffect, useState } from 'react';
import { onUserJoinedAuction, startAuctionConnection, joinAuction } from './../../../assets/Services/auctionHubService';
import getUserFromToken from '../../common/GetUserFromToken';

const JoinChat = () => {
  const [joinedUsers, setJoinedUsers] = useState([]);
  const userInfo = getUserFromToken();
  console.log("🧾 userInfo:", userInfo);


  useEffect(() => {
  const user = getUserFromToken();
  if (user) {
    console.log("🧾 userInfo:", user);

    const fullName = `${user.name} ${user.surname}`;
    joinAuction(user.id, fullName);
  } else {
    console.warn("⚠️ Token tapılmadı və ya userInfo undefined-dir");
  }
}, []);


  useEffect(() => {
    const setupConnection = async () => {
  try {
    const connection = await startAuctionConnection(userInfo.token);

    onUserJoinedAuction((data) => {

      if (data.users && Array.isArray(data.users)) {
        const userList = data.users.map((fullName, index) => ({
          id: index,
          fullName,
        }));
        setJoinedUsers(userList);
      }
    });
  } catch (err) {
    console.error("❌ SignalR bağlantısı alınmadı:", err);
  }
};


    if (userInfo?.token) {
      setupConnection();
    }
  }, []);

  return (
  <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">
    <h1 className="text-2xl font-semibold mb-4">Joined Users</h1>
    <ul>
      {joinedUsers && joinedUsers.length > 0 ? (
        joinedUsers.map((user, index) => (
          <li key={index} className="text-lg font-medium">{user}</li> // Burada `user` fullName olmalıdır
        ))
      ) : (
        <p className="text-gray-500">No users joined yet.</p>
      )}
    </ul>
  </div>
);

};

export default JoinChat;
