import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { SSEManager } from '../delegate/SSEManager';

const SSEContext = createContext<SSEManager | null>(null);

interface Props {
  children: ReactNode;
}

export function SSEProvider({ children }: Props) {
  const managerRef = useRef(new SSEManager());

  useEffect(() => {
    return () => {
      managerRef.current.closeAll();
    };
  }, []);

  return <SSEContext.Provider value={managerRef.current}>{children}</SSEContext.Provider>;
}

export function useSSEChannel(url: string, opts?: EventSourceInit) {
  const manager = useContext(SSEContext);
  if (!manager) throw new Error('useSSEChannel must be used inside SSEProvider');
  return manager.getDelegate(url, opts);
}
