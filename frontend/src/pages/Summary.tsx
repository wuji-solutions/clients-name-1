import { useEffect, useState } from 'react';
import { useAppContext } from '../providers/AppContextProvider';
import { service } from '../service/service';
import styled from 'styled-components';
import theme from '../common/theme';
import AnswerCard, { colorPalette } from '../components/AnswerCard';
import AccessRestricted from '../components/AccessRestricted';
import { ButtonCustom } from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface Answer {
  id: number;
  content: string;
}

interface QuestionData {
  question: {
    id: number;
    category: string;
    type: string;
    task: string;
    answers: Answer[];
  };
  correctAnswersCount: number;
  incorrectAnswersCount: number;
}

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
  border: '1px solid #000',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backgroundColor: theme.palette.main.primary,
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
  const correctPercent = total > 0 ? (correctAnswersCount / total) * 100 : 0;
  const incorrectPercent = total > 0 ? (incorrectAnswersCount / total) * 100 : 0;

  return (
    <Card>
      <Task>{question.task}</Task>
      <Category>Kategoria: {question.category}</Category>
      <AnswerList>
        {question.answers.map((answer, index) => (
          <AnswerCard
            backgroundcolor={colorPalette[index % colorPalette.length]}
            key={answer.id}
            isselected={false}
          >
            {answer.content}
          </AnswerCard>
        ))}
      </AnswerList>
      <ProgressContainer>
        <ProgressBar color="green" widthPercent={correctPercent} />
        <ProgressBar color="red" widthPercent={incorrectPercent} />
      </ProgressContainer>
      <Stats>
        <span>Poprawne: {correctAnswersCount}</span>
        <span>Niepoprawne: {incorrectAnswersCount}</span>
      </Stats>
    </Card>
  );
};

function Summary() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    service
      .getGameSummary()
      .then((response) => setSummary(response.data))
      .catch((error) => console.log(error));
  }, []);

  if (user !== 'admin') return <AccessRestricted />;

  return (
    <Container>
      <div style={{ width: '100%', height: '50px' }}>
        <ButtonCustom onClick={() => navigate('/konfiguracja')} >Powrót</ButtonCustom>
      </div>
      <div>{summary && summary.questions.map((question) => <QuestionCard data={question} />)}</div>
    </Container>
  );
}

export default Summary;
