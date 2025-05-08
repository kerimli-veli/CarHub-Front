import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

let connection = null;

export const startAuctionConnection = async (token) => {
  if (connection) {
    console.log("⚠️ Əvvəlki connection artıq mövcuddur");
    return connection;
  }

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
  console.log("➡️ joinAuction called with:", userId, fullName);
  if (!connection || connection.state !== HubConnectionState.Connected) {
    console.error("❌ AuctionHub bağlantısı yoxdur və ya bağlı deyil");
    return;
  }

  try {
    await connection.invoke("JoinAuction", userId, fullName);
    console.log("✅ joinAuction invoke edildi");
  } catch (err) {
    console.error("❌ joinAuction invoke error:", err);
  }
};


export const onUserJoinedAuction = (callback) => {
  if (!connection) {
    console.warn("❗ connection tapılmadı");
    return;
  }
  console.log("📡 Listening to UserJoinedAuction...");
  connection.on("UserJoinedAuction", (data) => {
    console.log("📡 UserJoinedAuction Event Data: ", data); 
    callback(data);
  });
};





