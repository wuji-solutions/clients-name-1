import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Configurations from './pages/Configurations';
import WaitingRoom from './pages/WaitingRoom';
import { AppProvider } from './providers/AppContextProvider';
import Quiz from './pages/quiz/Quiz';
import { SSEProvider } from './providers/SSEProvider';
import Summary from './pages/Summary';
import BoardgamePlayer from './pages/boardgame/BoardgamePlayer';
import BoardgameObserver from './pages/boardgame/BoardgameObserver';
import ExamParticipant from './pages/exam/ExamParticipant';
import ExamObserver from './pages/exam/ExamObserver';
import { FullScreenButton } from './components/Button';
import { ErrorProvider } from './providers/ErrorProvider';
import ErrorPopup from './components/ErrorPopup';

const context = globalThis.location.hostname === 'localhost' ? 'admin' : 'user';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <AppProvider>
      <FullScreenButton />
      <SSEProvider>
        <ErrorProvider>
          <ErrorPopup />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/konfiguracja" element={<Configurations />} />
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="/gra/quiz" element={<Quiz />} />
              <Route
                path="/gra/planszowa"
                element={context === 'user' ? <BoardgamePlayer /> : <BoardgameObserver />}
              />
              <Route
                path="/sprawdzian"
                element={context === 'user' ? <ExamParticipant /> : <ExamObserver />}
              />
              <Route path="/podsumowanie" element={<Summary />} />
              <Route path='*' element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </ErrorProvider>
      </SSEProvider>
    </AppProvider>
  </StrictMode>
);
