export {};

declare global {
  interface Window {
    electronAPI: {
      openRaportsFolder: () => void;
      openFile: () => string;
    };
  }
}
