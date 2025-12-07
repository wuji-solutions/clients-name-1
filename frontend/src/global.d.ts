export {};

declare global {
  interface Window {
    electronAPI: {
      openRaportsFolder: () => void;
      openFile: () => string;
      openHotspot: () => void;
      setWifiMaxPeers: (number) => any;
      getLimit: () => any;
      isHotspotOn: () => Promise;
      enableHostspot: (ssid, password, adapter) => void;
      getHotspotAdapter: () => Promise;
      configureHotspot: (ssid: string, password: string) => Promise<any>;
      getHotspotConfig: () => Promise<{ ssid: string; password: string }>;
      quitApp: () => void;
    };
  }
}
