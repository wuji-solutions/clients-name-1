import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import theme from "../common/theme";
import { ButtonChoose, ButtonCustom } from "../components/Button";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../common/config";
import { TEST_QUIZ } from "../common/test";
import { useAppContext } from "../providers/AppContextProvider";

const Container = styled.div({
  backgroundColor: theme.palette.main.background,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  color: "#fff",
});

const InstructionContainer = styled.div({
  width: "25%",
  padding: "5px",
});

const InstructionHeader = styled.div({
  margin: "auto",
  background: theme.palette.main.primary,
  paddingLeft: "10px",
  paddingRight: "10px",
  width: "fit-content",
  height: "50px",
  marginTop: "20px",
  textAlign: "center",
  alignContent: "center",
  borderRadius: "5px",
  color: "#fff",
});

const InstructionContent = styled.div({
  margin: "auto",
  marginTop: "10px",
  padding: "10px",
});

const ModeContainer = styled.div({
  width: "40%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "100px",
});

const ModeHeader = styled.div({
  margin: "auto",
  background: theme.palette.main.primary,
  paddingLeft: "10px",
  paddingRight: "10px",
  width: "fit-content",
  height: "50px",
  marginTop: "20px",
  textAlign: "center",
  alignContent: "center",
  borderRadius: "5px",
  color: "#fff",
});

const ModeContent = styled.div({
  margin: "auto",
  marginTop: "10px",
  padding: "10px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
});

const OptionsContainer = styled.div({
  width: "35%",
  display: "flex",
  flexDirection: "column",
});

const FileSelector = styled.div({
  color: "#fff",
  background: "#3377FF",
  opacity: "85%",
  border: "1px solid #000",
  borderRadius: "10px",
  width: "140px",
  height: "50px",
  padding: "5px",
  boxShadow: "0 3px 4px 0 rgba(0,0,0,0.24),0 4px 12px 0 rgba(0,0,0,0.19)",
  "&:hover": {
    boxShadow: "0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)",
  },
  "-webkit-transition-duration": "0.2s",
  transitionDuration: "0.2s",
  marginTop: "15px",
});

const ActionButtonContainer = styled.div({
  marginTop: "auto",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

function Configurations() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      console.log(files);
    },
  });

  const [mode, setMode] = useState<string | null>(null);

  const startLobby = () => {
    axios.post(BACKEND_ENDPOINT + "/manage/quiz", TEST_QUIZ, {
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      console.log(response);
      console.log("Successfully created new game");
      navigate("/waiting-room");
    }).catch((error) => console.log(error));
  };

  if (user === "user") {
    return (
      <Container>
        <h2 style={{ margin: "auto" }}>
          Widok przeznaczony tylko dla nauczyciela
        </h2>
      </Container>
    );
  }

  return (
    <Container>
      <InstructionContainer>
        <InstructionHeader>
          Instrukcja uruchomienia
        </InstructionHeader>
        <InstructionContent>
          Uruchom
        </InstructionContent>
      </InstructionContainer>
      <ModeContainer>
        <ModeHeader>
          Wybierz tryb rozgrywki
        </ModeHeader>
        <ModeContent>
          <ButtonChoose active={mode == "Quiz"} onClick={() => setMode("Quiz")}>
            Quiz
          </ButtonChoose>
          <ButtonChoose active={mode == "Test"} onClick={() => setMode("Test")}>
            Sprawdzian
          </ButtonChoose>
          <ButtonChoose active={mode == "Game"} onClick={() => setMode("Game")}>
            Plansza
          </ButtonChoose>
        </ModeContent>
      </ModeContainer>
      <OptionsContainer>
        <FileSelector {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Dodaj pytania...</p>
        </FileSelector>
        <ActionButtonContainer>
          <ButtonCustom onClick={() => startLobby()}>
            Otwórz poczekalnię
          </ButtonCustom>
          <ButtonCustom onClick={() => navigate("/")}>Powrót</ButtonCustom>
        </ActionButtonContainer>
      </OptionsContainer>
    </Container>
  );
}

export default Configurations;
