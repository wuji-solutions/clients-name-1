import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ButtonCustom } from '../components/Button';
import { useAppContext } from '../providers/AppContextProvider';
import AccessRestricted from '../components/AccessRestricted';
import theme from '../common/theme';

const Container = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Logo = styled.div({
  padding: '10px',
  alignContent: 'center',
  textAlign: 'center',
  borderRadius: '10px',
  width: 'auto',
  height: '200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 'auto',
  marginBottom: '100px',
  fontSize: '40px',
});

const LogoText = styled.div({
  color: theme.palette.main.logo,
  fontWeight: 'x-bold',
  textShadow:`1px 1px 0 ${theme.palette.main.logo_accent}, -3px 3px 0 ${theme.palette.main.logo_accent}, -1px -1px 0 ${theme.palette.main.logo_accent}, 1px -1px 0 ${theme.palette.main.logo_accent};`,

  fontSize: '100px',
});

const OptionContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  height: '200px',
  marginBottom: 'auto',
});


function Home() {
  const { isAdmin } = useAppContext();
  const navigate = useNavigate();

  if (!isAdmin()) {
    return <AccessRestricted />;
  }

  const openRaportMenu = () => {
    window.electronAPI.openRaportsFolder()
  }

  const quitApp = () => {
    window.electronAPI.quitApp();
  };

  return (
    <Container>
      <Logo>
        <LogoText>QUIZZOBARA</LogoText>
      </Logo>
      <OptionContainer>
        <ButtonCustom onClick={() => navigate('/konfiguracja')}>Rozpocznij</ButtonCustom>
        <ButtonCustom onClick={openRaportMenu} >Raporty</ButtonCustom>
        <ButtonCustom onClick={quitApp}>Wyjdź</ButtonCustom>
      </OptionContainer>
    </Container>
  );
}

export default Home;
