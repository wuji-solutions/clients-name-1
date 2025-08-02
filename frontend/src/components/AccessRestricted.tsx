import { styled } from "styled-components";
import theme from "../common/theme";

const Container = styled.div({
  backgroundColor: theme.palette.main.background,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  color: "#fff",
});

function AccessRestricted() {
  return (
    <Container>
      <h2 style={{ margin: "auto" }}>
        Widok przeznaczony tylko dla nauczyciela
      </h2>
    </Container>
  );
}

export default AccessRestricted;
