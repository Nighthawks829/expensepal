import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storagee:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Failed to save user to storage:", error);
        }
      }
    };

    saveUser();
  }, [user]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
