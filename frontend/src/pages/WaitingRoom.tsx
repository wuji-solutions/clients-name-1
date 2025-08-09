import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import theme from "../common/theme";
import { ButtonCustom } from "../components/Button";
import PlayerList from "../components/PlayerList";
import { useAppContext } from "../providers/AppContextProvider";
import { CustomTextInput } from "../components/Fields";
import "../service/service";
import { service } from "../service/service";
import { useSSEChannel } from "../providers/SSEProvider";
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from "../common/config";

const Container = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
});

const QRContainer = styled.div({
  margin: "auto",
  background: theme.palette.main.background,
  padding: "25px",
  borderRadius: "5px",
  border: "5px solid #000",
});

const ActionButtonContainer = styled.div({
  marginTop: "auto",
  marginBottom: "20px",
  marginRight: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "30%",
});

const UserInputContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  margin: "auto",
  gap: "60px",
  width: "80vw",
});

function WaitingRoom() {
  const { user, username, setUsername } = useAppContext();
  const delegate = useSSEChannel(
    `${
      user === "admin" ? BACKEND_ENDPOINT : BACKEND_ENDPOINT_EXTERNAL
    }/sse/quiz/events`,
  ); // change this to select a different mode based on some state
  const [identificator, setIdentificator] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = delegate.on('game-start', () => {
      // Add some sort of timer? Like a count down before the game actually starts
      navigate("/gra/quiz"); // change this to select a different mode based on some state
    });
    return unsubscribe;
  });

  const joinGame = () => {
    if (!identificator) return;
    service.joinGame(identificator).then((response) => {
      setUsername(response.data);
      sessionStorage.setItem("username", response.data);
      sessionStorage.setItem("userindex", identificator.toString());
    }).catch((error) => console.log(error));
  };

  const startGame = () => {
    service.startGame().then(() => {
      console.log('Game successfully started');
    }).catch((
      error,
    ) => console.log(error));
  };

  if (!user) return <></>;

  if (user === "user") {
    return (
      <Container>
        {!username
          ? (
            <UserInputContainer>
              <CustomTextInput
                placeholder="Podaj numer z dziennika / numer grupy"
                onChange={(e) => setIdentificator(parseInt(e.target.value))}
              />
              <ButtonCustom onClick={() => joinGame()}>
                Dołącz do gry
              </ButtonCustom>
            </UserInputContainer>
          )
          : (
            <UserInputContainer>
              <h4>Witaj {username}!</h4>
              Czekaj na rozpoczęcie rozgrywki
            </UserInputContainer>
          )}
      </Container>
    );
  }

  return (
    <Container>
      <PlayerList user={user} />
      <QRContainer>
        <QRCode value={"http://192.168.137.1:3000/waiting-room"} // NOSONAR
        />
      </QRContainer>
      <ActionButtonContainer>
        <ButtonCustom onClick={() => startGame()}>
          Zacznij grę
        </ButtonCustom>
        <ButtonCustom onClick={() => navigate("/konfiguracja")}>
          Powrót
        </ButtonCustom>
      </ActionButtonContainer>
    </Container>
  );
}

export default WaitingRoom;
