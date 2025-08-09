import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";

interface AppContextType {
  user: string | null;
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  userindex: number | null;
  setUserindex: React.Dispatch<React.SetStateAction<number | null>>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  username: null,
  setUsername: () => {},
  userindex: null,
  setUserindex: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userindex, setUserindex] = useState<number | null>(null);

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setUser("admin");
    } else {
      setUser("user");
    }
  }, []);

  useEffect(() => {
    const storedUserIndex = sessionStorage.getItem("userindex");
    const storedUsername = sessionStorage.getItem("username");

    if (storedUserIndex && storedUsername) {
      const parsedIndex = parseInt(storedUserIndex, 10);
      if (!isNaN(parsedIndex)) {
        setUserindex(parsedIndex);
      } else {
        setUserindex(null);
      }
      setUsername(storedUsername);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    username,
    setUsername,
    userindex,
    setUserindex,
  }), [user, username, setUsername]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
