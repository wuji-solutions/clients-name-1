import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import theme from "../common/theme";
import { ButtonCustom } from "../components/Button";

const Container = styled.div({
  backgroundColor: theme.palette.main.background,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
});

function WaitingRoom() {
  const navigate = useNavigate();

  return (
    <Container>
      <div
        style={{
          backgroundColor: "white",
          padding: "16px",
          width: "fit-content",
        }}
      >
        <QRCode value="http://192.168.137.1:3000" />
        <ButtonCustom onClick={() => navigate("/konfiguracja")}>Powrót</ButtonCustom>
      </div>
    </Container>
  );
}

export default WaitingRoom;
