import { useEffect, useState } from "react";
import { styled } from "styled-components";
import {
  BACKEND_ENDPOINT,
  BACKEND_ENDPOINT_EXTERNAL,
} from "../../common/config";
import { Question } from "../../common/types";
import { ButtonCustom } from "../../components/Button";
import { useAppContext } from "../../providers/AppContextProvider";
import { service } from "../../service/service";

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
  gap: "40px",
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
  ({ backgroundcolor, isselected }) => ({
    borderRadius: "20px",
    minHeight: "25px",
    width: "10em",
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    backgroundColor: isselected
      ? darkenColor(backgroundcolor, 0.2)
      : backgroundcolor,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    cursor: "pointer",
    transform: isselected ? "none" : "translateY(5px)",
    h2: {
      margin: 0,
      fontSize: "1rem",
    },
    userSelect: "none",
    "-webkit-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "-webkit-touch-callout": "none",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
  }),
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

const darkenColor = (color: string, percent: number) => {
  const f = parseInt(color.slice(1), 16);
  const t = percent * 255;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;

  const newR = Math.max(0, Math.round(R - t));
  const newG = Math.max(0, Math.round(G - t));
  const newB = Math.max(0, Math.round(B - t));

  return (
    "#" +
    (
      0x1000000 +
      newR * 0x10000 +
      newG * 0x100 +
      newB
    )
      .toString(16)
      .slice(1)
      .padStart(6, "0")
  );
};

const setQuestion = (
  user: string,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>,
) => {
  service.getCurrentQuestion(user, "quiz").then((response) =>
    setCurrentQuestion(response.data)
  ).catch((error) => console.log(error));
};

function Quiz() {
  const { user, username } = useAppContext();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [sendingAnswer, setSendingAnswer] = useState<boolean>(false);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const [questionEnded, setQuestionEnded] = useState<boolean>(false);
  const [questionStats, setQuestionStats] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(
      user === "admin"
        ? BACKEND_ENDPOINT + "/sse/quiz/next-question"
        : BACKEND_ENDPOINT_EXTERNAL + "/sse/quiz/next-question",
    );

    eventSource.onmessage = (_) => {
      if (!user) return;
      setQuestion(user, setCurrentQuestion);
      setAnswerCount(0);
      setQuestionAnswered(false);
      setQuestionEnded(false);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error: ", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  useEffect(() => {
    if (user != "admin") return;
    const eventSource = new EventSource(
      BACKEND_ENDPOINT + "/sse/quiz/answer-counter",
    );

    eventSource.onmessage = (event) => {
      setAnswerCount(event.data);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error: ", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
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

  if (user === "user") {
    return (
      <Container>
        {currentQuestion && (
          <AnswerContainer>
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
            <ButtonCustom
              disabled={sendingAnswer}
              onClick={() => handleAnswerSent()}
            >
              Wyślij odpowiedź
            </ButtonCustom>
          </AnswerContainer>
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
          {!questionEnded && (
            <ButtonCustom onClick={() => handleEndCurrentQuestion()}>
              Zakończ pytanie
            </ButtonCustom>
          )}
          {questionEnded && (
            <ButtonCustom>Przejdź do kolejnego pytania</ButtonCustom>
          )}
        </QuestionContainer>
      )}
    </Container>
  );
}

export default Quiz;
