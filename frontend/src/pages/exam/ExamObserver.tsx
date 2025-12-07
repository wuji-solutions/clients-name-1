import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { BACKEND_ENDPOINT } from '../../common/config';
import theme from '../../common/theme';
import { ExamConfig, ExamState } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import Timer from '../../components/Timer';
import { useSSEChannel } from '../../providers/SSEProvider';
import { getModeConfig } from '../../service/configService';
import { service } from '../../service/service';
import { useError } from '../../providers/ErrorProvider';

const Container = styled.div(() => ({
  width: 'calc(100%-20px)',
  height: '100%',
  margin: 'auto',
  overflowY: 'scroll',
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
  marginTop: '30px',
});

const UserStatsContainer = styled.div({
  padding: '10px',
  border: `4px solid ${theme.palette.main.accent}`,
  boxShadow: `0 4px 0 0 ${theme.palette.main.accent}`,
  borderRadius: '15px',
  width: '60%',
  height: '600px',
});

const EmptyStats = styled.div({
  fontSize: '25px',
  color: theme.palette.main.info_text,
  textShadow: 'none',
  textAlign: 'center',
  alignContent: 'center',
  margin: 'auto',
  height: '90%',
});

const GameConfigContainer = styled.div({
  padding: '10px',
  border: `4px solid ${theme.palette.main.accent}`,
  boxShadow: `0 4px 0 0 ${theme.palette.main.accent}`,
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
  marginBottom: '20px',
});

const ExamConfigDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
});

const ProgressBarContainer = styled.div({
  width: '300px',
  height: '30px',
  backgroundColor: '#eee',
  borderRadius: '15px',
  overflow: 'hidden',
  display: 'flex',
  fontSize: '15px',
  textAlign: 'center',
  alignContent: 'center',
});

const CorrectBar = styled.div<{ widthPercent: number }>(({ widthPercent }) => ({
  width: `${widthPercent}%`,
  backgroundColor: theme.palette.main.success,
  transition: 'width 0.3s ease',
  textAlign: 'center',
  alignContent: 'center',
}));

const IncorrectBar = styled.div<{ widthPercent: number }>(({ widthPercent }) => ({
  width: `calc(${widthPercent}% + 1px)`,
  background: `linear-gradient(to right, ${theme.palette.main.success} 0%, ${theme.palette.main.error} 15%)`,
  transition: 'width 0.3s ease',
  textAlign: 'center',
  alignContent: 'center',
  marginLeft: -1,
}));

const PlayerContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  padding: '20px',
  gap: '20px',
});

const Detail = styled.div({
  fontSize: '1.25em',
  display: 'flex',
  flexDirection: 'row',
  gap: '25px',
  margin: 'auto',
});

const DetailKey = styled.div({
  color: theme.palette.main.info_text,
  textShadow: 'none',
});

const DetailValue = styled.div({});

function SSEOnExamChangeListener({
  setExamState,
  setCheaters,
  examConfig,
}: {
  setExamState: Function;
  setCheaters: Function;
  examConfig: ExamConfig | undefined;
}) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT + '/sse/exam/admin-events', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('new-exam-state', (data: ExamState) => {
      setExamState(data);
    });
    return unsubscribe;
  }, [delegate]);

  useEffect(() => {
    const unsubscribe = delegate.on('player-cheated', (data) => {
      if (examConfig && examConfig.notifyTeacherOnCheating) {
        setCheaters((prev: any) => ({
          ...prev,
          [data.nickname]: {
            ...data,
          },
        }));
      }
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

interface Dictionary<T> {
  [Key: string]: T;
}

function ExamObserver() {
  const [examState, setExamState] = useState<ExamState>();
  const [examConfig, setExamConfig] = useState<ExamConfig>();
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [cheaters, setCheaters] = useState<Dictionary<string>>({});
  const navigate = useNavigate();
  const { setError } = useError();

  const [gracePeriod, setGracePeriod] = useState<number>();
  const [gracePeriodRemaining, setGracePeriodRemaining] = useState<number>();
  const endTimeRef = useRef<number | null>(null);
  const [allowExit, setAllowExit] = useState(false);

  useEffect(() => {
    if (!gracePeriod) return;

    endTimeRef.current = Date.now() + gracePeriod * 1000;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimeRef.current! - now) / 1000));
      setGracePeriodRemaining(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setAllowExit(true);
      }
    };

    const interval = setInterval(tick, 1000);
    tick();

    return () => clearInterval(interval);
  }, [gracePeriod]);

  useEffect(() => {
    getModeConfig().then((response) => {
      setExamConfig(response.data);
    });
  }, []);

  const handleExamEnd = () => {
    service
      .finishGame()
      .then((response) => {
        setExamFinished(true);
        setGracePeriod(examConfig?.additionalTimeToAnswerAfterFinishInSeconds);
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas wysyłania odpowiedzi:\n' + error.response.data.message)
      );
  };

  return (
    <Container>
      <SSEOnExamChangeListener setExamState={setExamState} setCheaters={setCheaters} examConfig={examConfig} />
      <TimerContainer>
        Pozostały czas:
        <Timer
          isAdmin={true}
          onFinish={() => {
            if (examConfig?.endImmediatelyAfterTime) {
              handleExamEnd();
            }
          }}
        />
      </TimerContainer>
      <PanelContainer>
        <UserStatsContainer>
          {examState ? (
            <>
              {examState?.playerState.map((playerState) => {
                const total = playerState.correctAnswers + playerState.incorrectAnswers;
                const correctPercent = total === 0 ? 0 : (playerState.correctAnswers / total) * 100;
                const incorrectPercent =
                  total === 0 ? 0 : (playerState.incorrectAnswers / total) * 100;
                return (
                  <PlayerContainer>
                    <strong style={{ fontSize: '22px' }}>
                      {playerState.nickname} {'(' + playerState.index + ')'}
                    </strong>
                    <ProgressBarContainer>
                      <CorrectBar widthPercent={correctPercent}>
                        {correctPercent > 19 && correctPercent.toFixed(1) + '%'}
                      </CorrectBar>
                      <IncorrectBar widthPercent={incorrectPercent}>
                        {incorrectPercent > 19 && incorrectPercent.toFixed(1) + '%'}
                      </IncorrectBar>
                    </ProgressBarContainer>
                    <strong style={{ fontSize: '20px' }}>PUNKTY: {playerState.points}</strong>
                    {cheaters[playerState.nickname] && (
                      <strong style={{ fontSize: '20px', color: theme.palette.main.error }}>
                        Oszukiwał
                      </strong>
                    )}
                  </PlayerContainer>
                );
              })}
            </>
          ) : (
            <EmptyStats>W tym miejscu pojawią się statystyki uczestników</EmptyStats>
          )}
        </UserStatsContainer>
        <GameConfigContainer>
          <span
            style={{
              color: theme.palette.main.info_text,
              textShadow: 'none',
              textAlign: 'center',
              fontSize: '20px',
              marginTop: '30px',
            }}
          >
            Zarządzanie sprawdzianem
          </span>
          <ExamConfigDetails>
            {examConfig && (
              <div
                style={{
                  padding: '0px 20px 0px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <Detail>
                  <DetailKey>Czas trwania: </DetailKey>
                  <DetailValue>{examConfig.totalDurationMinutes}min</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Czas na odpowiedź: </DetailKey>
                  <DetailValue>{examConfig.questionDurationSeconds}s</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Zakończ po upłynięciu czasu: </DetailKey>
                  <DetailValue>
                    {examConfig.additionalTimeToAnswerAfterFinishInSeconds ? 'Tak' : 'Nie'}
                  </DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Czas na odpowiedź po zakończeniu: </DetailKey>
                  <DetailValue>
                    {examConfig.additionalTimeToAnswerAfterFinishInSeconds}s
                  </DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Losowe pytania: </DetailKey>
                  <DetailValue>{examConfig.randomizeQuestions ? 'Tak' : 'Nie'}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Zerowanie punktów w razie oszustwa: </DetailKey>
                  <DetailValue>{examConfig.zeroPointsOnCheating ? 'Tak' : 'Nie'}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Zezwalaj na powrót: </DetailKey>
                  <DetailValue>{examConfig.allowGoingBack ? 'Tak' : 'Nie'}</DetailValue>
                </Detail>
              </div>
            )}
          </ExamConfigDetails>
          <ButtonContainer>
            {!examFinished && (
              <ButtonCustom onClick={handleExamEnd}>Zakończ sprawdzian</ButtonCustom>
            )}
            {examFinished && allowExit && (
              <ButtonCustom onClick={() => navigate('/konfiguracja')}>Wróć do menu</ButtonCustom>
            )}
            {examFinished && !allowExit && (
              <ButtonCustom disabled={true}>
                {gracePeriodRemaining && gracePeriodRemaining > 0
                  ? `${Math.floor(gracePeriodRemaining / 60)}:${gracePeriodRemaining % 60 >= 10 ? gracePeriodRemaining % 60 : '0' + (gracePeriodRemaining % 60)}`
                  : '-- : --'}
              </ButtonCustom>
            )}
          </ButtonContainer>
        </GameConfigContainer>
      </PanelContainer>
    </Container>
  );
}

export default ExamObserver;
