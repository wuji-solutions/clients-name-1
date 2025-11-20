import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import { Question, QuestionStats, QuizQuestion } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import { useAppContext } from '../../providers/AppContextProvider';
import { useSSEChannel } from '../../providers/SSEProvider';
import { service } from '../../service/service';
import theme from '../../common/theme';
import AnswerCard from '../../components/AnswerCard';
import { useNavigate } from 'react-router-dom';
import { SSEDelegate } from '../../delegate/SSEDelegate';
import { getPercentage, getColor, getParsedDifficultyLevel } from '../../common/utils';
import { useError } from '../../providers/ErrorProvider';

const Container = styled.div(() => ({
  width: '90%',
  margin: 'auto',
}));

export const QuestionContainer = styled.div(() => ({
  padding: '60px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
}));

export const QuestionHeader = styled.div(() => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  width: '100%',
  paddingBottom: '10px',
}));

const QuestionCategory = styled.span(() => ({
  fontSize: '25px',
  margin: 'auto',
  fontWeight: 'bold',
}));

const QuestionTask = styled.span(() => ({
  fontSize: '50px',
  margin: 'auto',
  fontWeight: 'bold',
}));

const AnswerContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
}));

const AnsweredContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  justifyContent: 'center',
  height: '100vh',
}));

const AnswerHeader = styled.h1(() => ({
  marginTop: '55px',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  padding: '20px',
}));

const AnswerColumn = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '35px',
  padding: '10px 0 40px 0',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  marginBottom: '35px',
}));

const AnswerGrid = styled.div(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '35px',
  padding: '40px',
  justifyItems: 'center',
  boxShadow: `0 3px 0 0 ${theme.palette.main.accent}`,
  marginBottom: '40px',
}));

const QuestionDifficulty = styled.div({
  width: 'fit-content',
  maxWidth: '340px',
  margin: 'auto',
  textAlign: 'center',
  fontSize: '22px',
});

const AnswerProgressBar = ({
  count,
  total,
  color,
}: {
  count: number;
  total: number;
  color: string;
}) => {
  const percent = getPercentage(count, total);

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: 'auto', marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.9rem',
          marginBottom: '5px',
          marginTop: '5px',
        }}
      >
        <span>Odpowiedziało osób:</span>
        <span>
          {percent}% ({count})
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#f0f0f0',
          border: `4px solid ${theme.palette.main.accent}`,
          boxShadow: `0 4px 2px 0 ${theme.palette.main.accent}`,
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

interface QuestionTaskWrapperProps {
  task: string;
  imageUrl: string | null;
  imageBase64: string | null;
}

export const QuestionTaskWrapper: React.FC<QuestionTaskWrapperProps> = ({
  task,
  imageUrl,
  imageBase64,
}) => {
  const resolvedImage = imageUrl ?? (imageBase64 ? `data:image/png;base64,${imageBase64}` : null);

  return (
    <QuestionTask>
      {task}

      {resolvedImage && (
        <img
          src={resolvedImage}
          alt="question"
          style={{
            maxWidth: '100%',
            maxHeight: '250px',
            objectFit: 'contain',
            marginTop: '10px',
          }}
        />
      )}
    </QuestionTask>
  );
};

function QuestionEndListener({
  setQuestionEnded,
  delegate,
}: {
  setQuestionEnded: React.Dispatch<React.SetStateAction<boolean>>;
  delegate: SSEDelegate;
}) {
  useEffect(() => {
    const unsubscribe = delegate.on('end-question', () => {
      setQuestionEnded(true);
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function Quiz() {
  const { user, isAdmin } = useAppContext();
  const navigate = useNavigate();
  const eventsDelegate = useSSEChannel(
    `${isAdmin() ? BACKEND_ENDPOINT : BACKEND_ENDPOINT_EXTERNAL}/sse/events`,
    { withCredentials: true }
  );
  const counterDelegate = useSSEChannel(`${BACKEND_ENDPOINT}/sse/quiz/answer-counter`, {
    withCredentials: true,
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [sendingAnswer, setSendingAnswer] = useState<boolean>(false);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const [questionEnded, setQuestionEnded] = useState<boolean>(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null);
  const { setError } = useError();

  const hasMoreQuestions = currentQuestion
    ? currentQuestion.questionNumber < currentQuestion.totalQuestions
    : null;

  useEffect(() => {
    const unsubscribe = eventsDelegate.on('next-question', () => {
      if (!user) return;
      setQuestion(user);
      setSelectedAnswers([]);
      setAnswerCount(0);
      setQuestionAnswered(false);
      setQuestionEnded(false);
      setQuestionStats(null);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!isAdmin()) return;
    const unsubscribe = counterDelegate.on('answer-counter', (data) => {
      setAnswerCount(data);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setQuestion(user);
  }, [user]);

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

  const handleAnswerSent = () => {
    setSendingAnswer(true);
    service
      .sendAnswer(
        selectedAnswers.map((id) => Number.parseInt(id)),
        'quiz'
      )
      .then((_) => setQuestionAnswered(true))
      .catch((error) =>
        setError('Wystąpił błąd podczas wysyłania odpowiedzi:\n' + error.response.data.message)
      )
      .finally(() => setSendingAnswer(false));
  };

  const handleEndCurrentQuestion = () => {
    service
      .endQuestion('quiz')
      .then((response) => {
        setQuestionStats(response.data);
        setQuestionEnded(true);
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas kończenia pytaina:\n' + error.response.data.message)
      );
  };

  const handleNextQuestion = () => {
    service.nextQuestion('quiz').catch((error) => {
      setError(
        'Wystąpił błąd podczas pobierania następnego pytania:\n' + error.response.data.message
      );
    });
  };

  const handleQuizEnd = () => {
    service
      .finishGame()
      .then(() => navigate('/podsumowanie'))
      .catch((error) => {
        setError('Wystąpił błąd podczas kończenia quizu:\n' + error.response.data.message);
      });
  };

  const setQuestion = (user: string) => {
    service
      .getCurrentQuestion(user, 'quiz')
      .then((response) => {
        const currentQuestion = response.data;
        if (user !== 'admin') {
          service
            .hasAnsweredQuestion(Number.parseInt(currentQuestion.id))
            .then((response) => {
              if (response.data.alreadyAnswered) {
                setQuestionAnswered(true);
                setSelectedAnswers(response.data.answerIds);
              }
            })
            .catch((error) =>
              setError(
                'Wystąpił błąd podczas sprawdzania czy gracz wysłał już odpowiedział na pytanie:\n' +
                  error.response.data.message
              )
            );
        }
        setCurrentQuestion(currentQuestion);
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas pobierania pytania:\n' + error.response.data.message)
      );
  };

  if (!user) return <>View not allowed</>;

  if (!isAdmin()) {
    return (
      <Container>
        {currentQuestion &&
          (!questionAnswered && !questionEnded ? (
            <AnswerContainer>
              <QuestionEndListener setQuestionEnded={setQuestionEnded} delegate={eventsDelegate} />
              <AnswerHeader>Udziel odpowiedzi na pytanie z ekranu</AnswerHeader>
              <AnswerColumn>
                {currentQuestion.answers.map((answer, index) => (
                  <AnswerCard
                    key={index}
                    isselected={selectedAnswers.includes(answer.id)}
                    backgroundcolor={getColor(index)}
                    onClick={() => handleAnswerSelected(answer.id)}
                  >
                    <h2>{answer.text}</h2>
                  </AnswerCard>
                ))}
              </AnswerColumn>

              <ButtonCustom disabled={sendingAnswer} onClick={() => handleAnswerSent()}>
                Wyślij odpowiedź
              </ButtonCustom>
            </AnswerContainer>
          ) : questionAnswered ? (
            <AnsweredContainer>
              <AnswerHeader>Udzieliłeś odpowiedzi</AnswerHeader>
            </AnsweredContainer>
          ) : (
            <AnsweredContainer>
              <AnswerHeader>Czekaj na kolejne pytanie</AnswerHeader>
            </AnsweredContainer>
          ))}
      </Container>
    );
  }

  return (
    <Container>
      {currentQuestion && (
        <QuestionContainer>
          <QuestionHeader>
            <QuestionCategory>{currentQuestion.category}</QuestionCategory>
            <QuestionTaskWrapper
              task={currentQuestion.task}
              imageUrl={currentQuestion.imageUrl}
              imageBase64={currentQuestion.imageBase64}
            />
            <QuestionDifficulty>
              {getParsedDifficultyLevel(currentQuestion.difficultyLevel)}
            </QuestionDifficulty>
            <h3>Ilość odpowiedzi: {answerCount}</h3>
          </QuestionHeader>
          {!questionStats ? (
            <AnswerGrid>
              {currentQuestion.answers.map((answer, index) => (
                <AnswerCard
                  key={index}
                  isselected={false}
                  backgroundcolor={getColor(index)}
                  style={{ cursor: 'default', width: '400px', height: '70px', maxHeight: '70px' }}
                >
                  <span
                    style={{
                      fontSize: `${Math.max(14, 40 - answer.text.length / 2)}px`,
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    {answer.text}
                  </span>
                </AnswerCard>
              ))}
            </AnswerGrid>
          ) : (
            <AnswerGrid>
              {questionStats.answers.map((answer, index) => (
                <div key={index}>
                  <AnswerProgressBar
                    count={answer.count}
                    total={answerCount}
                    color={
                      answer.answer.isCorrect
                        ? theme.palette.main.success
                        : theme.palette.main.error
                    }
                  />
                  <AnswerCard
                    isselected={answer.answer.isCorrect}
                    backgroundcolor={getColor(index)}
                    style={{ cursor: 'default', width: '400px', height: '70px', maxHeight: '70px' }}
                  >
                    <span
                      style={{
                        fontSize: `${Math.max(14, 40 - answer.answer.text.length / 2)}px`,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      {answer.answer.text}
                    </span>
                  </AnswerCard>
                </div>
              ))}
            </AnswerGrid>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            {!questionEnded && (
              <ButtonCustom onClick={() => handleEndCurrentQuestion()}>
                Zakończ pytanie
              </ButtonCustom>
            )}
            {questionEnded && (
              <ButtonCustom
                disabled={hasMoreQuestions === false}
                onClick={() => handleNextQuestion()}
              >
                Przejdź do kolejnego pytania
              </ButtonCustom>
            )}
            <ButtonCustom onClick={handleQuizEnd}>Zakończ quiz</ButtonCustom>
          </div>
        </QuestionContainer>
      )}
    </Container>
  );
}

export default Quiz;
