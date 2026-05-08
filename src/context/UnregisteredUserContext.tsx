import { createContext, useContext, useState, useEffect, useRef } from "react";

interface UnregisteredUserContextType {
  unregisteredUserId: number;
}

const UnregisteredUserContext = createContext<UnregisteredUserContextType | undefined>(undefined);


export const UnregisteredUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unregisteredUserId, setUnregisteredUserId] = useState<number>(-1);
  const hasCreatedRef = useRef(false); /* create only one user in react Strict mode */

  const createNewUser = () => {
    fetch("https://ticketlords-backend-app-ripdj.ondigitalocean.app/users/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Created new user:", data);
        setUnregisteredUserId(data);
        localStorage.setItem("unregisteredUserId", data.toString());
      })
      .catch((error) => console.error("Error creating unregistered user:", error));
  };

  useEffect(() => {
    if (hasCreatedRef.current) return;
    hasCreatedRef.current = true;

    const savedId = localStorage.getItem("unregisteredUserId");

    if (savedId) {
      // Verify the saved ID is valid with backend
      fetch(`https://ticketlords-backend-app-ripdj.ondigitalocean.app/users/user/${savedId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Invalid ID");
          setUnregisteredUserId(parseInt(savedId));
        })
        .catch(() => {
          // If invalid, create new ID
          console.log("Saved ID invalid, creating new one...");
          createNewUser();
        });
    } else {
      // No saved ID, create new one
      createNewUser();
    }
  }, []);

  // Global console command to check user ID
  useEffect(() => {
    (window as any).getCurrentUserId = () => {
      console.log("Current unregistered user ID:", unregisteredUserId);
    };
  }, [unregisteredUserId]);

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
