import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface AppContextType {
  theme: string;
  user: string | null;
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string|null>>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  theme: "light",
  username: null,
  setUsername: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState<string|null>(null);
  const [username, setUsername] = useState<string|null>(null);

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
        setUser('admin');
    } else {
        setUser('user');
    }
    console.log(window.location.hostname)
  }, [])

  const value = useMemo(() => ({
    user,
    theme,
    username,
    setUsername
  }), [user, theme, username, setUsername]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
