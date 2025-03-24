// import { jwt_decode } from "jwt-decode";  // Named import

// const getUserFromToken = () => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) return null;

//   try {
//     const decoded = jwt_decode(token);  // Burada jwt_decode kullanılıyor
//     return {
//       name: decoded.name || "",
//       surname: decoded.surname || "",
//       imagePath: decoded.imagePath || "default-profile.jpg"
//     };
//   } catch (error) {
//     console.error("Token decode error:", error);
//     return null;
//   }
// };

// export default getUserFromToken;
