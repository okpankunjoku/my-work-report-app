import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedEmployee = localStorage.getItem("employee");

    if (!savedEmployee) {
      return null;
    }

    try {
      return JSON.parse(savedEmployee);
    } catch (error) {
      console.error("Failed to parse saved employee:", error);
      localStorage.removeItem("employee");
      return null;
    }
  });

  // Login
  const login = (employee, token) => {
    setUser(employee);

    localStorage.setItem(
      "employee",
      JSON.stringify(employee)
    );

    localStorage.setItem(
      "token",
      token
    );
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("employee");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};