import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import theme from '../../common/theme';
import { CompleteExamResponseDto, ExamQuestion } from '../../common/types';
import { getParsedDifficultyLevel, lightenColor } from '../../common/utils';
import AnswerCard from '../../components/AnswerCard';
import { ButtonCustom } from '../../components/Button';
import Timer from '../../components/Timer';
import { useAppContext } from '../../providers/AppContextProvider';
import { useSSEChannel } from '../../providers/SSEProvider';
import { service } from '../../service/service';
import { useError } from '../../providers/ErrorProvider';
import Divider from '../../components/Divider';
import ReactMarkdownParser from '../../components/ReactMarkdownParser';

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
  marginTop: '0px',
});

const QuestionHeader = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  padding: '0 0 20px 0',
});

const AdditionalInfo = styled.div({
  color: theme.palette.main.info_text,
  textAlign: 'center',
  textShadow: 'none',
});

const ExamFinishedContainer = styled.div({
  color: theme.palette.main.info_text,
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
  marginLeft: 'auto',
  marginRight: 'auto',
  fontSize: '15px',
  textAlign: 'center',
});

const QuestionTask = styled.div({
  width: 'fit-content',
  maxWidth: '340px',
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
  maxHeight: '370px',
  gap: '15px',

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

const ResultContainer = styled.div({
  width: '100%',
  marginTop: '50px',
  padding: '0 0 30px 0',
  display: 'flex',
  flexDirection: 'column',
});

const Results = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'fit-content',
  margin: 'auto',
  fontSize: '23px',
});

const Details = styled.div({
  borderTop: `3px solid ${theme.palette.main.accent}`,
  padding: '10px 20px 0 20px',
  width: 'calc(90%-25px)',
});

const AnswerContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 'fit-content',
});

const NoMoreQuestions = styled.div({
  width: 'calc(100%-20px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  textAlign: 'center',
  padding: '20px',
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

  const [examResults, setExamResults] = useState<CompleteExamResponseDto | null>(null);

  const [disableAnswers, setDisableAnswers] = useState(false);

  useEffect(() => {
    const hasPlayerCheated = sessionStorage.getItem('playerCheated');
    setPlayerCheated(!!hasPlayerCheated);
  }, []);

  useEffect(() => {
    if (!examFinished) {
      service
        .getCurrentQuestion('user', 'exam')
        .then((response) => {
          if (response.data.playerAlreadyAnswered) {
            setSelectedAnswers(response.data.playerAnswerDto.selectedIds);
          } else {
            setSelectedAnswers([]);
          }
          setAllowGoingBack(response.data?.allowGoingBack);
          setCurrentQuestion(response.data);
        })
        .catch((error) => {
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
      setExamResults(null);
      setDisableAnswers(false);
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
          if (!allowGoingBack) setDisableAnswers(true);
          setForceFetchCurrentQuestion(!forceFetchCurrentQuestion);
        }
        setPlayerCheated(false);
        sessionStorage.removeItem('playerCheated');
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas wysyłania odpowiedzi:\n' + error.response.data.message)
      )
      .finally(() => {
        setAnswerSent(false);
      });
  };

  const handleUserExamFinish = () => {
    service
      .userFinishedExam()
      .then((response) => setExamResults(response.data))
      .catch((error) =>
        setError(
          'Podczas pobierania wyników sprawdzianu wystąpił błąd:\n' + error.response.data.message
        )
      );
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
      {!examResults && (
        <TimerContainer>
          <Timer />
        </TimerContainer>
      )}
      {examResults && (
        <ResultContainer>
          <Results>
            <h2>Twój wynik:</h2>
            <h3>{examResults.totalPointsEarned} pkt</h3>
          </Results>
          {examResults.questionsAnswered && (
            <Details>
              <div
                style={{
                  color: theme.palette.main.info_text,
                  margin: 'auto',
                  width: 'fit-content',
                  textShadow: 'none',
                  fontSize: '27px',
                  marginBottom: '20px',
                }}
              >
                Podsumowanie
              </div>
              {examResults.questionsAnswered.map((data, index) => (
                <AnswerContainer>
                  <QuestionCategory>{data.question.category}</QuestionCategory>
                  <QuestionTask>
                    <ReactMarkdownParser content={data.question.task} />
                  </QuestionTask>
                  <QuestionAnswerGrid
                    isGrid={false}
                    style={{
                      gap: '0',
                      marginTop: '0',
                      marginBottom: '0',
                      boxShadow: 'none',
                      height: 'fit-content',
                    }}
                  >
                    {data.question.answers.map((answer) => (
                      <AnswerCard
                        key={`answer_${answer.id}_result`}
                        backgroundcolor={theme.palette.main.primary}
                        isselected={data.selectedAnswerIds.includes(answer.id)}
                        style={{
                          minHeight: '10px',
                          padding: '10px 10px 20px 10px',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginTop: '10px',
                          marginBottom: '10px',
                          transfrom: 'none',
                        }}
                      >
                        <ReactMarkdownParser content={answer.text} />
                      </AnswerCard>
                    ))}
                    {data.isCorrect ? (
                      <span
                        style={{
                          color: theme.palette.main.success,
                          margin: 'auto',
                          marginTop: '20px',
                        }}
                      >
                        Prawidłowa
                      </span>
                    ) : (
                      <span
                        style={{
                          color: theme.palette.main.error,
                          margin: 'auto',
                          marginTop: '20px',
                        }}
                      >
                        Nieprawidłowa
                      </span>
                    )}
                    {index + 1 != examResults.questionsAnswered?.length && (
                      <div
                        style={{
                          marginTop: '20px',
                          borderTop: `3px solid ${theme.palette.main.accent}`,
                        }}
                      />
                    )}
                  </QuestionAnswerGrid>
                </AnswerContainer>
              ))}
            </Details>
          )}
          <ButtonCustom onClick={fetchNextQuestion}>Dalej</ButtonCustom>
        </ResultContainer>
      )}
      {currentQuestion && !examResults ? (
        <QuestionContainer>
          <QuestionHeader>
            {currentQuestion.questionNumber <= currentQuestion.totalBaseQuestions && (
              <AdditionalInfo>{`${currentQuestion.questionNumber}/${currentQuestion.totalBaseQuestions}`}</AdditionalInfo>
            )}
            <QuestionCategory>{currentQuestion.category}</QuestionCategory>
            <QuestionTask>
              <ReactMarkdownParser content={currentQuestion.task} />
            </QuestionTask>
            <QuestionDifficulty>
              {getParsedDifficultyLevel(currentQuestion.difficultyLevel)}
            </QuestionDifficulty>
          </QuestionHeader>
          <QuestionAnswerGrid isGrid={currentQuestion.answers.length > 4}>
            {currentQuestion.answers.map((answer) => (
              <AnswerCard
                onClick={() => (disableAnswers ? '' : handleAnswerSelected(answer.id))}
                key={`answer_${answer.id}_question_${currentQuestion.id}`}
                backgroundcolor={theme.palette.main.primary}
                isselected={selectedAnswers.includes(answer.id)}
              >
                <ReactMarkdownParser content={answer.text} />
              </AnswerCard>
            ))}
          </QuestionAnswerGrid>
          <ButtonContainer>
            <ButtonCustom
              disabled={answerSent || disableAnswers}
              onClick={handleAnswerSent}
              style={{ maxWidth: '160px' }}
            >
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
            {currentQuestion.questionNumber == currentQuestion.totalBaseQuestions && (
              <>
                <div
                  style={{
                    borderTop: `3px solid ${theme.palette.main.accent}`,
                    width: '100%',
                    background: 'transparent',
                  }}
                />
                <ButtonCustom onClick={() => handleUserExamFinish()} style={{ maxWidth: '230px' }}>
                  {'Zakończ podejście'}
                </ButtonCustom>
              </>
            )}
          </ButtonContainer>
        </QuestionContainer>
      ) : (
        !examResults && (
          <NoMoreQuestions>
            <h2>
              Gratulacje, udało ci się odpowiedzieć na wszystkie pytania! Możesz opuścić sprawdzian.
            </h2>
          </NoMoreQuestions>
        )
      )}
    </Container>
  );
}

export default ExamParticipant;
