import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import theme from '../../common/theme';
import { ExtendedQuestion } from '../../common/types';
import { getParsedDifficultyLevel } from '../../common/utils';
import AnswerCard from '../../components/AnswerCard';
import { ButtonCustom, FullScreenButton } from '../../components/Button';
import Timer from '../../components/Timer';
import { useAppContext } from '../../providers/AppContextProvider';
import { service } from '../../service/service';

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
  margin: 'auto',
  fontSize: '20px',
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

function ExamParticipant() {
  const [currentQuestion, setCurrentQuestion] = useState<ExtendedQuestion | null>(null);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const { user } = useAppContext();
  const [playerCheated, setPlayerCheated] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);

  const [allowGoingBack, setAllowGoingBack] = useState<boolean>(false);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState<boolean>(false);

  const [answerSent, setAnswerSent] = useState<boolean>(false);

  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const hasPlayerCheated = sessionStorage.getItem('playerCheated')
    setPlayerCheated(!!hasPlayerCheated);
  }, [])

  useEffect(() => {
    if (!examFinished) {
      service.getCurrentQuestion('user', 'exam').then((response) => {
        if (response.data.playerAlreadyAnswered) {
          setSelectedAnswers(
            response.data.playerAnswerDto.selectedIds
          );
        } else {
          setSelectedAnswers([]);
        }
        setCurrentQuestion(response.data);
        setHasAnsweredQuestion(response.data.playerAlreadyAnswered);
      });
    }
  }, []);

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
    if (hasAnsweredQuestion) return;
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

  const setFetchNextQuestion = () => {
    service.nextQuestionExam().then((response) => {
      if (response.data.playerAlreadyAnswered) {
        setSelectedAnswers(
          response.data.playerAnswerDto.selectedIds
        );
      } else {
        setSelectedAnswers([]);
      }
      setCurrentQuestion(response.data);
      setHasAnsweredQuestion(response.data.playerAlreadyAnswered);
    });
  }

  const handleAnswerSent = () => {
    setAnswerSent(true);
    service
      .sendAnswer(
        selectedAnswers.map((id) => Number.parseInt(id)),
        'exam',
        playerCheated,
      )
      .then((response) => {
        console.log(response.data)
        setFetchNextQuestion()
      })
      .catch((e) => {
        if (e.data.status == 404 && e.data.message === 'Nie ma więcej pytań') {
          setExamFinished(true);
        } else {
          console.log(e)
        }
      })
      .finally(() => {
        setAnswerSent(false);
      })
  };

  return (
    <Container>
      <TimerContainer>
        <FullScreenButton />
        <Timer />
      </TimerContainer>
      {currentQuestion ? (
        <QuestionContainer>
          <QuestionHeader>
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
            {!hasAnsweredQuestion && <ButtonCustom disabled={answerSent} onClick={handleAnswerSent} >Odpowiedz</ButtonCustom>}
            {allowGoingBack && (
              <ButtonOptionContainer>
                <ButtonCustom>{'< POWRÓT'}</ButtonCustom>
                <ButtonCustom>{'NASTĘPNE >'}</ButtonCustom>
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
