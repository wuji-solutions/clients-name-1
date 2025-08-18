import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import { Question, QuestionStats } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import { useAppContext } from '../../providers/AppContextProvider';
import { useSSEChannel } from '../../providers/SSEProvider';
import { service } from '../../service/service';
import theme from '../../common/theme';
import AnswerCard, { colorPalette } from '../../components/AnswerCard';
import { useNavigate } from 'react-router-dom';
import { SSEDelegate } from '../../delegate/SSEDelegate';
import { getPercentage } from '../../common/utils';

const Container = styled.div(() => ({
  width: '90%',
  margin: 'auto',
}));

const QuestionContainer = styled.div(() => ({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
}));

const QuestionHeader = styled.div(() => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
}));

const QuestionCategory = styled.span(() => ({
  fontSize: '35px',
  margin: 'auto',
  fontWeight: 'bold',
}));

const QuestionTask = styled.span(() => ({
  fontSize: '80px',
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
  marginTop: '30px',
}));

const AnswerColumn = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '35px',
  padding: '40px',
}));

const AnswerGrid = styled.div(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '35px',
  padding: '40px',
  justifyItems: 'center',
}));

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
    <div style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.9rem',
          marginBottom: '5px',
          marginTop: '10px',
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
          border: `1px solid #000`,
          boxShadow: '0 2px 2px 0 rgba(0,0,0,10)',
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
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [sendingAnswer, setSendingAnswer] = useState<boolean>(false);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const [questionEnded, setQuestionEnded] = useState<boolean>(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null);

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
        selectedAnswers.map((id) => parseInt(id)),
        'quiz'
      )
      .then((_) => setQuestionAnswered(true))
      .catch((error) => console.error(error))
      .finally(() => setSendingAnswer(false));
  };

  const handleEndCurrentQuestion = () => {
    service
      .endQuestion()
      .then((response) => {
        setQuestionStats(response.data);
        setQuestionEnded(true);
      })
      .catch((error) => console.error(error));
  };

  const handleNextQuestion = () => {
    service.nextQuestion();
  };

  const setQuestion = (user: string) => {
    service
      .getCurrentQuestion(user, 'quiz')
      .then((response) => {
        const currentQuestion = response.data;
        if (user !== 'admin') {
          service
            .hasAnsweredQuestion(parseInt(currentQuestion.id))
            .then((response) => {
              if (response.data.alreadyAnswered) {
                setQuestionAnswered(true);
                setSelectedAnswers(response.data.answerIds);
              }
            })
            .catch((error) => console.log(error));
        }
        setCurrentQuestion(currentQuestion);
      })
      .catch((error) => console.log(error));
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
                    backgroundcolor={colorPalette[index % colorPalette.length]}
                    onClick={() => handleAnswerSelected(answer.id)}
                  >
                    <h2>{answer.content}</h2>
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
            <QuestionTask>{currentQuestion.task}</QuestionTask>
            <h3>Ilość odpowiedzi: {answerCount}</h3>
          </QuestionHeader>
          {!questionStats ? (
            <AnswerGrid>
              {currentQuestion.answers.map((answer, index) => (
                <AnswerCard
                  key={index}
                  isselected={false}
                  backgroundcolor={colorPalette[index % colorPalette.length]}
                  style={{ cursor: 'default' }}
                >
                  <h2>{answer.content}</h2>
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
                    backgroundcolor={colorPalette[index % colorPalette.length]}
                    style={{ cursor: 'default', marginTop: '10px' }}
                  >
                    <h2>{answer.answer.content}</h2>
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
              <ButtonCustom onClick={() => handleNextQuestion()}>
                Przejdź do kolejnego pytania
              </ButtonCustom>
            )}
            <ButtonCustom onClick={() => navigate('/podsumowanie')}>Zakończ quiz</ButtonCustom>
          </div>
        </QuestionContainer>
      )}
    </Container>
  );
}

export default Quiz;
