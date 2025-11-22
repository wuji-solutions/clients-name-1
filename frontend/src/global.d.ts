export {};

declare global {
  interface Window {
    electronAPI: {
      openRaportsFolder: () => void;
      openFile: () => string;
      openHotspot: () => void;
      setWifiMaxPeers: (number) => any;
      getLimit: () => any;
    };
  }
}
