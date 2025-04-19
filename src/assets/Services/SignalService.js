import { HubConnectionBuilder } from "@microsoft/signalr"; 

let connection = null; 

export const startConnection = async () => {
  if (connection) return connection; 

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];

  if (!token) {
    console.error("Access token tapılmadı");
    return;
  }

  connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7282/chatHub", {
      accessTokenFactory: () => token, 
    })
    .build();

  await connection.start();
  console.log("SignalR bağlantısı uğurla quruldu");
  return connection;
};

export const registerOnMessage = (callback) => {
  if (!connection) {
    console.error("SignalR əlaqəsi hələ qurulmayıb");
    return;
  }

  connection.on("ReceiveMessage", (senderId, receiverId, messageText) => {
    console.log("Yeni mesaj gəldi:", { senderId, receiverId, messageText });
    callback(senderId, receiverId, messageText); 
  });
};

export const sendMessage = async (receiverId, message) => {
  if (!connection) {
    console.error("SignalR əlaqəsi hələ qurulmayıb");
    return;
  }

  const senderUserId = localStorage.getItem("userId");
  if (!senderUserId) {
    console.error("İstifadəçi identifikatoru tapılmadı");
    return;
  }

  try {
    await connection.invoke("SendMessage", receiverId, message);
    console.log("Mesaj göndərildi:", message);
  } catch (error) {
    console.error("Mesaj göndərilərkən xəta:", error);
  }
};
