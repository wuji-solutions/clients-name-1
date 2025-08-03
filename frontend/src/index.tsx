import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Configurations from "./pages/Configurations";
import WaitingRoom from "./pages/WaitingRoom";
import { AppProvider } from "./providers/AppContextProvider";
import Quiz from "./pages/quiz/Quiz";

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
          <Route path="/gra/quiz" element={<Quiz />} />
        </Routes>
      </Router>
    </AppProvider>
  </React.StrictMode>,
);
