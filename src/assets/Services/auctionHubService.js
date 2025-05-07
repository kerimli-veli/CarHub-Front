import { HubConnectionBuilder } from "@microsoft/signalr";

let connection = null;

export const startAuctionConnection = async (token) => {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/auctionhub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();
  console.log("📡 AuctionHub bağlantısı quruldu");

  return connection;
};

export const joinAuction = async (userId, fullName) => {
  if (!connection) {
    console.error("AuctionHub bağlantısı yoxdur");
    return;
  }

  await connection.invoke("JoinAuction", userId, fullName);
};
