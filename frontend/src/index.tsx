import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Configurations from "./pages/Configurations";
import WaitingRoom from "./pages/WaitingRoom";
import { AppProvider } from "./providers/AppContextProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/konfiguracja" element={<Configurations />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
        </Routes>
      </Router>
    </AppProvider>
  </React.StrictMode>,
);
