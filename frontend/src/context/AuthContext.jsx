import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserDetail = async () => {
      setLoading(true);
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/get-me`,
          {
            withCredentials: true,
          }
        );
        setUser(data.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getUserDetail();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
