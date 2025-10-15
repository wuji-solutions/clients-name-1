import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { BACKEND_ENDPOINT } from '../../common/config';
import theme from '../../common/theme';
import { ExamState, QuizConfig } from '../../common/types';
import { lightenColor } from '../../common/utils';
import { ButtonCustom, FullScreenButton } from '../../components/Button';
import Timer from '../../components/Timer';
import { useSSEChannel } from '../../providers/SSEProvider';
import { service } from '../../service/service';

const Container = styled.div(() => ({
  width: 'calc(100%-20px)',
  height: '100%',
  margin: 'auto',
  overflow: 'hidden',
  padding: '0 20px 0 20px',
}));

const TimerContainer = styled.div({
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end',
  padding: '10px',
  marginLeft: 'auto',
});

const PanelContainer = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const UserStatsContainer = styled.div({
  padding: '10px',
  border: `3px solid ${theme.palette.main.accent}`,
  borderRadius: '15px',
  width: '60%',
  height: '600px',
});

const EmptyStats = styled.div({
  fontSize: '25px',
  color: lightenColor(theme.palette.main.accent, 0.1),
  textShadow: 'none',
  textAlign: 'center',
  alignContent: 'center',
  margin: 'auto',
  height: '90%',
});

const GameConfigContainer = styled.div({
  padding: '10px',
  border: `3px solid ${theme.palette.main.accent}`,
  borderRadius: '15px',
  width: '35%',
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const ButtonContainer = styled.div({
  textAlign: 'center',
  alignContent: 'center',
});

const ExamConfigDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const ProgressBarContainer = styled.div({
  width: "200px",
  height: "20px",
  backgroundColor: "#eee",
  borderRadius: "10px",
  overflow: "hidden",
  display: "flex",
});

const CorrectBar = styled.div<{ widthPercent: number }>(({ widthPercent }) => ({
  width: `${widthPercent}%`,
  backgroundColor: "#4caf50",
  transition: "width 0.3s ease",
}));

const IncorrectBar = styled.div<{ widthPercent: number }>(({ widthPercent }) => ({
  width: `${widthPercent}%`,
  backgroundColor: "#f44336",
  transition: "width 0.3s ease",
}));

const PlayerContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  padding: '20px',
  gap: '20px',
});

function SSEOnExamChangeListener({ setExamState }: { setExamState: Function }) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT + '/sse/exam/admin-events', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('new-exam-state', (data: ExamState) => {
      console.log(data);
      setExamState(data);
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function ExamObserver() {
  const [examState, setExamState] = useState<ExamState>();
  const [examConfig, setExamConfig] = useState<QuizConfig>();

  useEffect(() => {
    service.getModeConfig().then((response) => {
      console.log(response.data);
      setExamConfig(response.data)
    });
  }, []);

  return (
    <Container>
      <SSEOnExamChangeListener setExamState={setExamState} />
      <TimerContainer>
        <FullScreenButton />
        Pozostały czas:
        <Timer isAdmin={true} />
      </TimerContainer>
      <PanelContainer>
        <UserStatsContainer>
          {examState ? (
            <>
              {examState?.playerState.map((playerState) => {
                const total = playerState.correctAnswers + playerState.incorrectAnswers;
                const correctPercent = total === 0 ? 0 : (playerState.correctAnswers / total) * 100;
                const incorrectPercent = total === 0 ? 0 : (playerState.incorrectAnswers / total) * 100;
                return (
              <PlayerContainer>
                <strong>{playerState.nickname} {'(' + playerState.index + ')'}</strong>
                <ProgressBarContainer>
                  <CorrectBar widthPercent={correctPercent} />
                  <IncorrectBar widthPercent={incorrectPercent} />
                </ProgressBarContainer>
                <strong>PUNKTY: {playerState.points}</strong>
              </PlayerContainer>
            )})}
            </>
          ) : (
            <EmptyStats>W tym miejscu pojawią się statystyki uczestników</EmptyStats>
          )}
        </UserStatsContainer>
        <GameConfigContainer>
          <span style={{ color: lightenColor(theme.palette.main.accent, 0.1), textShadow: 'none', textAlign: 'center', fontSize: '20px' }}>
            Zarządzanie sprawdzianem
          </span>
          <ExamConfigDetails>
            
          </ExamConfigDetails>
          <ButtonContainer>
            <ButtonCustom>Zakończ sprawdzian</ButtonCustom>
          </ButtonContainer>
        </GameConfigContainer>
      </PanelContainer>
    </Container>
  );
}

export default ExamObserver;
