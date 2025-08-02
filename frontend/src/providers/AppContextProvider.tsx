import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface AppContextType {
  user: string | null;
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string|null>>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  username: null,
  setUsername: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
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
    username,
    setUsername
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
