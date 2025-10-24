import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import theme from '../../common/theme';
import { ExamQuestion } from '../../common/types';
import { getParsedDifficultyLevel, lightenColor } from '../../common/utils';
import AnswerCard from '../../components/AnswerCard';
import { ButtonCustom } from '../../components/Button';
import Timer from '../../components/Timer';
import { useAppContext } from '../../providers/AppContextProvider';
import { useSSEChannel } from '../../providers/SSEProvider';
import { service } from '../../service/service';
import { useError } from '../../providers/ErrorProvider';

export const Container = styled.div(() => ({
  width: '100%',
  height: 'fit-content',
  margin: 'auto',
  overflow: 'hidden',
}));

const TimerContainer = styled.div({
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end',
  padding: '10px',
  marginLeft: 'auto',
});

const QuestionContainer = styled.div({
  width: '100%',
  marginTop: '10px',
});

const QuestionHeader = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  padding: '0 0 20px 0',
});

const AdditionalInfo = styled.div({
  color: lightenColor(theme.palette.main.accent, 0.1),
  textAlign: 'center',
  textShadow: 'none',
});

const ExamFinishedContainer = styled.div({
  color: lightenColor(theme.palette.main.accent, 0.1),
  textAlign: 'center',
  textShadow: 'none',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
});

const QuestionCategory = styled.div({
  width: 'fit-content',
  maxWidth: '300px',
  margin: 'auto',
  fontSize: '15px',
  textAlign: 'center',
});

const QuestionTask = styled.div({
  width: 'fit-content',
  maxWidth: '340px',
  maxHeight: '150px',
  margin: 'auto',
  fontSize: '18px',
  textAlign: 'center',
});

const QuestionDifficulty = styled.div({
  width: 'fit-content',
  maxWidth: '340px',
  margin: 'auto',
  textAlign: 'center',
  fontSize: '15px',
});

const QuestionAnswerGrid = styled.div<{ isGrid: boolean }>(({ isGrid }) => ({
  width: '99%',
  paddingTop: '10px',
  paddingBottom: '20px',
  margin: 'auto',
  marginTop: '10px',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  overflowY: 'auto',
  height: '320px',
  gap: '10px',

  display: 'flex',
  flexDirection: 'column',

  ...(isGrid && {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(4, auto)',
    overflowY: 'auto',
  }),
}));

const ButtonContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '20px',
});

const ButtonOptionContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
});

function SSEOnEventListener({ setExamFinished }: { setExamFinished: Function }) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT_EXTERNAL + '/sse/events', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('game-finish', () => {
      setExamFinished(true);
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function ExamParticipant() {
  const [currentQuestion, setCurrentQuestion] = useState<ExamQuestion | null>(null);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const { user } = useAppContext();
  const [playerCheated, setPlayerCheated] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);

  const [allowGoingBack, setAllowGoingBack] = useState<boolean>(false);

  const [answerSent, setAnswerSent] = useState<boolean>(false);

  const [forceFetchCurrentQuestion, setForceFetchCurrentQuestion] = useState<boolean>(false);

  const { setError } = useError();

  useEffect(() => {
    const hasPlayerCheated = sessionStorage.getItem('playerCheated');
    setPlayerCheated(!!hasPlayerCheated);
  }, []);

  useEffect(() => {
    if (!examFinished) {
      service.getCurrentQuestion('user', 'exam').then((response) => {
        if (response.data.playerAlreadyAnswered) {
          setSelectedAnswers(response.data.playerAnswerDto.selectedIds);
        } else {
          setSelectedAnswers([]);
        }
        setAllowGoingBack(response.data?.allowGoingBack);
        setCurrentQuestion(response.data);
      }).catch((error) => {
        if (error.status === 409) {
          setExamFinished(true);
        } else {
          setError('Wystąpił błąd podczas pobierania pytania:\n' + error.response.data.message);
        }
      });
    }
  }, [forceFetchCurrentQuestion]);

  const handleChangeQuestion = (next: boolean) => {
    const questionService = next ? service.nextQuestionExam : service.previousQuestionExam;
    questionService().then((response) => {
      if (response.status == 200) {
        if (response.data.playerAlreadyAnswered) {
          setSelectedAnswers(response.data.playerAnswerDto.selectedIds);
        } else {
          setSelectedAnswers([]);
        }
        setAllowGoingBack(response.data?.allowGoingBack);
        setCurrentQuestion(response.data);
      }
    });
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPlayerCheated(true);
        sessionStorage.setItem('playerCheated', 'Yes');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAnswerSelected = (id: string) => {
    setSelectedAnswers((prevState) => {
      const answers = [...prevState];
      if (answers.includes(id)) {
        return answers.filter((answer) => answer !== id);
      } else {
        answers.push(id);
        return answers;
      }
    });
  };

  const fetchNextQuestion = () => {
    service.nextQuestionExam().then((response) => {
      if (response.data.playerAlreadyAnswered) {
        setSelectedAnswers(response.data.playerAnswerDto.selectedIds);
      } else {
        setSelectedAnswers([]);
      }
      setCurrentQuestion(response.data);
    });
  };

  const handleAnswerSent = () => {
    setAnswerSent(true);
    service
      .sendAnswer(
        selectedAnswers.map((id) => Number.parseInt(id)),
        'exam',
        playerCheated
      )
      .then((response) => {
        if (response.status === 204) {
          setExamFinished(true);
          return;
        }
        if (
          currentQuestion &&
          currentQuestion.questionNumber != currentQuestion.totalBaseQuestions
        ) {
          fetchNextQuestion();
        } else {
          setForceFetchCurrentQuestion(!forceFetchCurrentQuestion);
        }
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas wysyłania odpowiedzi:\n' + error.response.data.message)
      )
      .finally(() => {
        setAnswerSent(false);
      });
  };

  if (examFinished)
    return (
      <Container style={{ height: '80vh' }}>
        <ExamFinishedContainer>Sprawdzian się zakończył</ExamFinishedContainer>
      </Container>
    );

  return (
    <Container>
      <SSEOnEventListener setExamFinished={setExamFinished} />
      <TimerContainer>
        <Timer />
      </TimerContainer>
      {currentQuestion ? (
        <QuestionContainer>
          <QuestionHeader>
            {currentQuestion.questionNumber <= currentQuestion.totalBaseQuestions && (
              <AdditionalInfo>{`${currentQuestion.questionNumber}/${currentQuestion.totalBaseQuestions}`}</AdditionalInfo>
            )}
            <QuestionCategory>{currentQuestion.category}</QuestionCategory>
            <QuestionTask>{currentQuestion.task}</QuestionTask>
            <QuestionDifficulty>
              {getParsedDifficultyLevel(currentQuestion.difficultyLevel)}
            </QuestionDifficulty>
          </QuestionHeader>
          <QuestionAnswerGrid isGrid={currentQuestion.answers.length > 4}>
            {currentQuestion.answers.map((answer) => (
              <AnswerCard
                onClick={() => handleAnswerSelected(answer.id)}
                key={`answer_${answer.id}_question_${currentQuestion.id}`}
                backgroundcolor={theme.palette.main.primary}
                isselected={selectedAnswers.includes(answer.id)}
              >
                {answer.text}
              </AnswerCard>
            ))}
          </QuestionAnswerGrid>
          <ButtonContainer>
              <ButtonCustom disabled={answerSent} onClick={handleAnswerSent}>
                Odpowiedz
              </ButtonCustom>
            {allowGoingBack && (
              <ButtonOptionContainer>
                {currentQuestion.questionNumber > 1 && (
                  <ButtonCustom
                    onClick={() => handleChangeQuestion(false)}
                    style={{ maxWidth: '130px' }}
                  >
                    {'< Powrót'}
                  </ButtonCustom>
                )}
                {currentQuestion.questionNumber < currentQuestion.totalBaseQuestions && (
                  <ButtonCustom
                    onClick={() => handleChangeQuestion(true)}
                    style={{ maxWidth: '130px' }}
                  >
                    {'Następne >'}
                  </ButtonCustom>
                )}
              </ButtonOptionContainer>
            )}
          </ButtonContainer>
        </QuestionContainer>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default ExamParticipant;
