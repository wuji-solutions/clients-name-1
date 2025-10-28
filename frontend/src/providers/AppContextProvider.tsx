import Cookies from 'js-cookie';
import { service } from '../service/service';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

interface AppContextType {
  user: string | null;
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  userindex: number | null;
  setUserindex: Dispatch<SetStateAction<number | null>>;
  isAdmin: () => boolean;
}

const AppContext = createContext<AppContextType>({
  user: null,
  username: null,
  setUsername: () => {},
  userindex: null,
  setUserindex: () => {},
  isAdmin: () => false,
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userindex, setUserindex] = useState<number | null>(null);

  useEffect(() => {
    if (window.location.hostname === "" || window.location.hostname === "localhost") {
      setUser('admin');
    } else {
      setUser('user');
    }
  }, []);

  useEffect(() => {
    if (!Cookies.get('JSESSIONID') || window.location.hostname === 'localhost' ) return;

    service.validateSessionID()
      .then()
      .catch((error) => {
        if (error.status == 401) {
          Cookies.remove('JSESSIONID')
          sessionStorage.removeItem('userindex');
          sessionStorage.removeItem('username');
        }
      })

    const storedUserIndex = sessionStorage.getItem('userindex');
    const storedUsername = sessionStorage.getItem('username');

    if (storedUserIndex && storedUsername) {
      const parsedIndex = Number.parseInt(storedUserIndex, 10);
      if (!isNaN(parsedIndex)) {
        setUserindex(parsedIndex);
      } else {
        setUserindex(null);
      }
      setUsername(storedUsername);
    }
  }, []);

  const isAdmin = () => user === 'admin';

  const value = useMemo(
    () => ({
      user,
      username,
      setUsername,
      userindex,
      setUserindex,
      isAdmin,
    }),
    [user, username, userindex]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
