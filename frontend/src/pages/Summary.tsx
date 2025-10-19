import { useEffect, useState } from 'react';
import { useAppContext } from '../providers/AppContextProvider';
import { service } from '../service/service';
import styled from 'styled-components';
import theme from '../common/theme';
import AnswerCard from '../components/AnswerCard';
import AccessRestricted from '../components/AccessRestricted';
import { ButtonCustom } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { QuestionData } from '../common/types';
import { getColor, getPercentage, lightenColor } from '../common/utils';
import { useError } from '../providers/ErrorProvider';

interface Props {
  data: QuestionData;
}

interface Summary {
  questions: QuestionData[];
}

const Container = styled.div(() => ({
  width: '90%',
  margin: 'auto',
  padding: '10px',
}));

const Card = styled.div(() => ({
  width: '100%',
  maxWidth: '600px',
  padding: '16px',
  borderRadius: '16px',
  border: `4px solid ${theme.palette.main.accent}`,
  boxShadow: `0 5px ${theme.palette.main.accent}`,
  backgroundColor: 'transparent',
  margin: 'auto',
  marginBottom: '16px',
}));

const Task = styled.div(() => ({
  fontSize: '28px',
  fontWeight: 600,
  marginBottom: '8px',
}));

const Category = styled.div(() => ({
  fontSize: '18px',
  marginBottom: '16px',
}));

const AnswerList = styled.ul(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '15px',
  padding: '10px',
  justifyItems: 'center',
}));

const ProgressContainer = styled.div(() => ({
  width: '100%',
  height: '16px',
  backgroundColor: '#eee',
  borderRadius: '8px',
  display: 'flex',
  overflow: 'hidden',
}));

const ProgressBar = styled.div<{ color: string; widthPercent: number }>(
  ({ color, widthPercent }) => ({
    height: '100%',
    backgroundColor: color,
    width: `${widthPercent}%`,
    boxShadow: `0 5px ${theme.palette.main.accent}`,
  })
);

const Stats = styled.div(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '16px',
  marginTop: '4px',
}));

const QuestionCard = ({ data }: Props) => {
  const { question, correctAnswersCount, incorrectAnswersCount } = data;

  const total = correctAnswersCount + incorrectAnswersCount;
  const correctPercent = getPercentage(correctAnswersCount, total);
  const incorrectPercent = getPercentage(incorrectAnswersCount, total);

  return (
    <Card>
      <Task>{question.task}</Task>
      <Category>Kategoria: {question.category}</Category>
      <AnswerList>
        {question.answers.map((answer, index) => (
          <AnswerCard backgroundcolor={getColor(index)} key={answer.id} isselected={false}>
            {answer.text}
          </AnswerCard>
        ))}
      </AnswerList>
      <ProgressContainer>
        <ProgressBar color="green" widthPercent={correctPercent} />
        <ProgressBar color="red" widthPercent={incorrectPercent} />
      </ProgressContainer>
      <Stats>
        <span style={{ textShadow: 'none', color: lightenColor(theme.palette.main.accent, 0.1) }}>
          Poprawne: {correctAnswersCount}
        </span>
        <span style={{ textShadow: 'none', color: lightenColor(theme.palette.main.accent, 0.1) }}>
          Niepoprawne: {incorrectAnswersCount}
        </span>
      </Stats>
    </Card>
  );
};

function Summary() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const { setError } = useError();

  useEffect(() => {
    service
      .getGameSummary()
      .then((response) => setSummary(response.data))
      .catch((error) =>
        setError(
          'Wystąpił błąd podczas pobierania podsumowania gry:\n' + error.response.data.message
        )
      );
  }, []);

  if (user !== 'admin') return <AccessRestricted />;

  return (
    <Container>
      <div
        style={{
          width: '100%',
          height: '50px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <ButtonCustom onClick={() => navigate('/konfiguracja')} style={{ margin: 0 }}>
          Powrót
        </ButtonCustom>
      </div>
      <div>{summary && summary.questions.map((question) => <QuestionCard data={question} />)}</div>
    </Container>
  );
}

export default Summary;
