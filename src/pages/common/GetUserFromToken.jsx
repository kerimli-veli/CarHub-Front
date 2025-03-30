import  jwt_decode  from "jwt-decode";
import Cookies from "js-cookie"; 

const getUserFromToken = () => {
    const token = Cookies.get("accessToken");
    if (!token) return null;
  
    try {
      const decoded = jwt_decode(token); 
      return {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], // ID'yi doğru alıyoruz
        // name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
        // surname: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || "",
        // imagePath: decoded.imagePath || "default-profile.jpg"
      };
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  };
  
export default getUserFromToken;
