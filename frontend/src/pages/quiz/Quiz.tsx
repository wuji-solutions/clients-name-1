import { useEffect, useState } from "react";
import { styled } from "styled-components";
import {
  BACKEND_ENDPOINT,
  BACKEND_ENDPOINT_EXTERNAL,
} from "../../common/config";
import { Question, QuestionStats } from "../../common/types";
import { ButtonCustom } from "../../components/Button";
import { useAppContext } from "../../providers/AppContextProvider";
import { useSSEChannel } from "../../providers/SSEProvider";
import { service } from "../../service/service";
import theme from "../../common/theme";

const Container = styled.div(() => ({
  width: "90%",
  margin: "auto",
}));

const QuestionContainer = styled.div(() => ({
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
}));

const QuestionHeader = styled.div(() => ({
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
}));

const QuestionCategory = styled.span(() => ({
  fontSize: "35px",
  margin: "auto",
  fontWeight: "bold",
}));

const QuestionTask = styled.span(() => ({
  fontSize: "80px",
  margin: "auto",
  fontWeight: "bold",
}));

const AnswerContainer = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
}));

const AnsweredContainer = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "center",
  height: '100vh',
}));

const AnswerHeader = styled.h1(() => ({
  marginTop: "30px",
}));

const AnswerColumn = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "35px",
  padding: "40px",
}));

const AnswerGrid = styled.div(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "35px",
  padding: "40px",
  justifyItems: "center",
}));

const AnswerCard = styled.div<{ backgroundcolor: string; isselected: boolean }>(
  ({ backgroundcolor, isselected }) => {
    const base = backgroundcolor;
    const gradient = isselected
      ? `linear-gradient(135deg, ${darkenColor(base, 0.2)}, ${
        darkenColor(base, 0.35)
      })`
      : `linear-gradient(135deg, ${base}, ${darkenColor(base, 0.15)})`;

    return {
      borderRadius: "20px",
      minHeight: "25px",
      width: "10em",
      maxWidth: "500px",
      margin: "auto",
      padding: "20px",
      background: gradient,
      boxShadow: `0 4px 1px 0 ${darkenColor(base, 0.6)}`,
      border: `2px solid ${darkenColor(base, 0.5)}`,
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      cursor: "pointer",
      transform: isselected ? "none" : "translateY(5px)",
      userSelect: "none",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "-webkit-touch-callout": "none",
      outline: "none",
      WebkitTapHighlightColor: "transparent",

      "& h2": {
        margin: 0,
        fontSize: "1rem",
      },
    };
  },
);

const colorPalette = [
  "#FF6B6B",
  "#FFA500",
  "#FCEB59",
  "#78C07C",
  "#5A8B9E",
  "#6A5ACD",
  "#DDA0DD",
  "#FF69B4",
];

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(255 * amount);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `rgb(${R}, ${G}, ${B})`;
}

const setQuestion = (
  user: string,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>,
) => {
  service.getCurrentQuestion(user, "quiz").then((response) =>
    setCurrentQuestion(response.data)
  ).catch((error) => console.log(error));
};

const AnswerProgressBar = ({
  count,
  total,
  color,
}: {
  count: number;
  total: number;
  color: string;
}) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.9rem",
          marginBottom: "5px",
          marginTop: "10px",
        }}
      >
        <span>Odpowiedziało osób:</span>
        <span>{percent}% ({count})</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#f0f0f0",
          border: `1px solid #000`,
          boxShadow: "0 2px 2px 0 rgba(0,0,0,10)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: color,
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};

function Quiz() {
  const { user, username } = useAppContext();
  const delegate = useSSEChannel(
    `${
      user === "admin" ? BACKEND_ENDPOINT : BACKEND_ENDPOINT_EXTERNAL
    }/sse/quiz/events`,
    { withCredentials: true },
  );
  const counterDelegate = useSSEChannel(
    `${BACKEND_ENDPOINT}/sse/quiz/answer-counter`,
    { withCredentials: true },
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [sendingAnswer, setSendingAnswer] = useState<boolean>(false);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const [questionEnded, setQuestionEnded] = useState<boolean>(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(
    null,
  );

  useEffect(() => {
    const unsubscribe = delegate.on("next-question", () => {
      if (!user) return;
      setQuestion(user, setCurrentQuestion);
      setSelectedAnswers([]);
      setAnswerCount(0);
      setQuestionAnswered(false);
      setQuestionEnded(false);
      setQuestionStats(null);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (user !== "admin") return;
    const unsubscribe = counterDelegate.on("answer-counter", (data) => {
      console.log(data);
      setAnswerCount(data);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setQuestion(user, setCurrentQuestion);
  }, [user]);

  const handleAnswerSelected = (id: string) => {
    console.log(id);
    setSelectedAnswers((prevState) => {
      console.log(prevState);
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
    service.sendAnswer(
      selectedAnswers.map((id) => parseInt(id)),
      "quiz",
    ).then((_) => setQuestionAnswered(true)).catch((error) =>
      console.error(error)
    ).finally(() => setSendingAnswer(false));
  };

  const handleEndCurrentQuestion = () => {
    service.endQuestion().then((response) => {
      console.log(response.data);
      setQuestionStats(response.data);
      setQuestionEnded(true);
    }).catch((error) => console.error(error));
  };

  const handleNextQuestion = () => {
    service.nextQuestion();
  };

  if (!user) return <>View not allowed</>;

  if (user === "user") {
    return (
      <Container>
        {currentQuestion && (
          !questionAnswered
            ? (
              <AnswerContainer>
                <AnswerHeader>
                  Udziel odpowiedzi na pytanie z ekranu
                </AnswerHeader>
                <AnswerColumn>
                  {currentQuestion.answers.map((answer, index) => (
                    <AnswerCard
                      key={index}
                      isselected={selectedAnswers.includes(answer.id)}
                      backgroundcolor={colorPalette[
                        index % colorPalette.length
                      ]}
                      onClick={() => handleAnswerSelected(answer.id)}
                    >
                      <h2>{answer.content}</h2>
                    </AnswerCard>
                  ))}
                </AnswerColumn>

                <ButtonCustom
                  disabled={sendingAnswer}
                  onClick={() => handleAnswerSent()}
                >
                  Wyślij odpowiedź
                </ButtonCustom>
              </AnswerContainer>
            )
            : (
              <AnsweredContainer>
                <AnswerHeader>Udzieliłeś już odpowiedzi</AnswerHeader>
              </AnsweredContainer>
            )
        )}
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
          {!questionStats
            ? (
              <AnswerGrid>
                {currentQuestion.answers.map((answer, index) => (
                  <AnswerCard
                    key={index}
                    isselected={false}
                    backgroundcolor={colorPalette[index % colorPalette.length]}
                    style={{ cursor: "default" }}
                  >
                    <h2>{answer.content}</h2>
                  </AnswerCard>
                ))}
              </AnswerGrid>
            )
            : (
              <AnswerGrid>
                {questionStats.answers.map((answer, index) => (
                  <div key={index}>
                    <AnswerProgressBar
                      count={answer.count}
                      total={answerCount}
                      color={answer.answer.isCorrect
                        ? theme.palette.main.success
                        : theme.palette.main.error} // change the color to green/red based on correctness
                    />
                    <AnswerCard
                      isselected={answer.answer.isCorrect
                        ? answer.answer.isCorrect
                        : false}
                      backgroundcolor={colorPalette[
                        index % colorPalette.length
                      ]}
                      style={{ cursor: "default", marginTop: "10px" }}
                    >
                      <h2>{answer.answer.content}</h2>
                    </AnswerCard>
                  </div>
                ))}
              </AnswerGrid>
            )}
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
        </QuestionContainer>
      )}
    </Container>
  );
}

export default Quiz;
