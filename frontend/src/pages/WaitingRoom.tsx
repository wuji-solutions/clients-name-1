import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import theme from "../common/theme";
import { ButtonCustom } from "../components/Button";
import PlayerList from "../components/PlayerList";
import { useAppContext } from "../providers/AppContextProvider";
import axios from "axios";
import { BACKEND_ENDPOINT_EXTERNAL } from "../common/config";
import { CustomTextInput } from "../components/Fields";

const Container = styled.div({
  backgroundColor: theme.palette.main.background,
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
  const navigate = useNavigate();

  const joinGame = () => {
    axios.post(BACKEND_ENDPOINT_EXTERNAL + "/games/quiz/join", { index: 2 }, {
      withCredentials: true,
    })
      .then((response) => {
        setUsername(response.data);
      }).catch((error) => console.log(error));
  };

  if (!user) return <></>;

  if (user === "user") {
    return (
      <Container>
        {!username
          ? (
            <UserInputContainer>
              <CustomTextInput placeholder="Podaj numer z dziennika / numer grupy" />
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
        <QRCode value={BACKEND_ENDPOINT_EXTERNAL + "/waiting-room"} // NOSONAR
        />
      </QRContainer>
      <ActionButtonContainer>
        <ButtonCustom>
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
