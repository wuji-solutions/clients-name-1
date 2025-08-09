// SSEProvider.tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { SSEManager } from '../delegate/SSEManager';

const SSEContext = createContext<SSEManager | null>(null);

export const SSEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const managerRef = useRef(new SSEManager());

  useEffect(() => {
    return () => {
      managerRef.current.closeAll();
    };
  }, []);

  return (
    <SSEContext.Provider value={managerRef.current}>
      {children}
    </SSEContext.Provider>
  );
};

export function useSSEChannel(url: string, opts?: EventSourceInit) {
  const manager = useContext(SSEContext);
  if (!manager) throw new Error('useSSEChannel must be used inside SSEProvider');
  return manager.getDelegate(url, opts);
}
