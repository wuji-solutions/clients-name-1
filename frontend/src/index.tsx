import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
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
import TransitionWrapper from './wrapper/TransitionWrapper';

const context = (globalThis.location.hostname === 'localhost' || globalThis.location.hostname === '') ? 'admin' : 'user';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// const Router = context === 'admin' ? HashRouter : BrowserRouter;

const pages = [
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <Configurations />,
    path: '/konfiguracja',
  },
  {
    element: <WaitingRoom />,
    path: '/waiting-room',
  },
  {
    element: <Quiz />,
    path: '/gra/quiz',
  },
  {
    element: <BoardgameObserver />,
    path: '/gra/planszowa',
    alt_element: <BoardgamePlayer />,
  },
  {
    element: <ExamObserver />,
    path: '/sprawdzian',
    alt_element: <ExamParticipant />,
  },
  {
    element: <Summary />,
    path: '/podsumowanie',
  },
];

root.render(
  <StrictMode>
    <AppProvider>
      <FullScreenButton />
      <SSEProvider>
        <ErrorProvider>
          <ErrorPopup />
          <Router>
            <Routes>
              {pages.map((page) => (
                <Route
                  key={`page_${page.path}`}
                  path={page.path}
                  element={
                    <TransitionWrapper>
                      {context === 'user' && page.alt_element ? page.alt_element : page.element}
                    </TransitionWrapper>
                  }
                />
              ))}
            </Routes>
          </Router>
        </ErrorProvider>
      </SSEProvider>
    </AppProvider>
  </StrictMode>
);
