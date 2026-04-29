import { createContext, useContext, useState, useEffect, useRef } from "react";

interface UnregisteredUserContextType {
  unregisteredUserId: number | null;
}

const UnregisteredUserContext = createContext<UnregisteredUserContextType | undefined>(undefined);

export const UnregisteredUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unregisteredUserId, setUnregisteredUserId] = useState<number | null>(null);
  const hasCreatedRef = useRef(false); /* create only one user in react Strict mode */

  useEffect(() => {
    if (hasCreatedRef.current) return;
    hasCreatedRef.current = true;

    // Check if ID already exists in localStorage
    const savedId = localStorage.getItem("unregisteredUserId");
    if (savedId) {
        setUnregisteredUserId(parseInt(savedId));
        return;
    }

    // Create unregistered user on first visit
    fetch("http://10.212.25.185:8080/users/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Backend response:", data); // Add this to see what's returned
            if (data.id) {
            setUnregisteredUserId(data.id);
            localStorage.setItem("unregisteredUserId", data.id.toString());
            } else {
            console.error("No ID in response:", data);
            }
        })
        .catch((error) => console.error("Error creating unregistered user:", error));
  }, []);

  return (
    <UnregisteredUserContext.Provider value={{ unregisteredUserId }}>
      {children}
    </UnregisteredUserContext.Provider>
  );
};

export const useUnregisteredUser = () => {
  const context = useContext(UnregisteredUserContext);
  if (!context) throw new Error("useUnregisteredUser must be used within UnregisteredUserProvider");
  return context;
};