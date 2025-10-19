import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type ErrorContextType = {
  error: string | null;
  setError: (msg: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(() => ({ error, setError }), [error]);

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useError must be used inside an ErrorProvider');
  return ctx;
}
