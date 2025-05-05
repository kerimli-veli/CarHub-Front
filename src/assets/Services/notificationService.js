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
      "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/notificationHub",
      {
        accessTokenFactory: () => token,
      }
    )
    .build();

  await connection.start();
  console.log("Bildiriş bağlantısı uğurla quruldu");
  return connection;
};

export const registerOnNotification = (callback) => {
    if (!connection) {
      console.error("SignalR bağlantısı yoxdur");
      return;
    }
  
    // Əvvəlki listener-i sil
    connection.off("ReceiveNotification");
  
    // Yeni listener əlavə et
    connection.on("ReceiveNotification", (message) => {
      console.log("Yeni bildiriş gəldi:", message);
      callback(message);
    });
  };
  
