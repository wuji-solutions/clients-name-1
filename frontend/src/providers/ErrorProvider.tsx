import React, { createContext, useContext, useState, ReactNode } from 'react';

type ErrorContextType = {
  error: string | null;
  setError: (msg: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  return <ErrorContext.Provider value={{ error, setError }}>{children}</ErrorContext.Provider>;
};

export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useError must be used inside an ErrorProvider');
  return ctx;
}
