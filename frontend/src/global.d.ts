export {};

declare global {
  interface Window {
    electronAPI: {
      openRaportsFolder: () => void;
    };
  }
}