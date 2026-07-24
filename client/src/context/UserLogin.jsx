import { createContext, useEffect, useState } from "react";
import { UserData } from "./UserData";

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // 🔹 Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("jobUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Login function
  const login = (email, password) => {

    const verify = UserData.find(
      (u) => u.username === email && u.password === password
    );

    if (verify) {
      setUser(verify);
      localStorage.setItem("jobUser", JSON.stringify(verify));
      setError("");
    } else {
      setUser(null);
      setError("Invalid Details");
    }
  };

  // 🔹 Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("jobUser");
  };

  return (
    <UserContext.Provider value={{ user, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;