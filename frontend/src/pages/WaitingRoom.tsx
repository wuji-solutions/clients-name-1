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

const Container = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
});

const QRContainer = styled.div({
  margin: "auto",
});

const ActionButtonContainer = styled.div({
  marginTop: "auto",
  marginBottom: "20px",
  marginRight: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
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
  const [identificator, setIdentificator] = useState<number | null>(null);
  const navigate = useNavigate();

  const joinGame = () => {
    if (!identificator) return;
    service.joinGame(identificator).then((response) => {
      setUsername(response.data);
      sessionStorage.setItem('username', response.data);
      sessionStorage.setItem('userindex', identificator.toString());
    }).catch((error) => console.log(error));
  };

  const startGame = () => {
    service.startGame().then((response) => {
      console.log(response);
      navigate("/gra/quiz") // change this to select a different mode based on some state
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
