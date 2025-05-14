import { HubConnectionBuilder } from "@microsoft/signalr";

let connection = null;

export const startConnection = async () => {
  if (connection) return connection;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  if (!token) {
    console.error("Access token tapılmadı");
    return;
  }

  connection = new HubConnectionBuilder()
    .withUrl(
      "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/notificationHub",
      {
        accessTokenFactory: () => token,
      }
    )
    .build();

  await connection.start();
  console.log("Bildiriş bağlantısı uğurla quruldu");
  return connection;
};

const shownMessageIds = new Set();

export const registerOnNotification = (callback) => {
  if (!connection) {
    console.error("SignalR bağlantısı yoxdur");
    return;
  }

  connection.off("ReceiveNotification");

  connection.on("ReceiveNotification", (message) => {
    console.log("Yeni bildiriş gəldi:", message);

    if (!shownMessageIds.has(message.id)) {
      callback(message);
      shownMessageIds.add(message.id);
    }
  });
};



  
