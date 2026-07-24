import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserToken(storedToken);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error('❌ Error loading user from localStorage:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      setUser(null);
      setUserToken(null);
    }
  }, []);

  // 🔹 Register user
  const register = async (name, email, password) => {
    setLoading(true);
    setError("");
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/register`, {
        name,
        email,
        password
      });

      if (data.success) {
        setUser(data.user);
        setUserToken(data.token);
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login user
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/login`, {
        email,
        password
      });

      if (data.success) {
        setUser(data.user);
        setUserToken(data.token);
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout user
  const logout = () => {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  };

  // 🔹 Upload resume
  const uploadResume = async (formData) => {
    setError("");
    
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/upload-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      if (data.success) {
        // Update user object with new resume
        const updatedUser = { ...user, resume: data.resume };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        userToken,
        loading,
        error,
        register,
        login,
        logout,
        uploadResume,
        backendUrl
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthProvider;
