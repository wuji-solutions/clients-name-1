import React from 'react';
import { styled } from 'styled-components';
import theme from '../common/theme';
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from '../components/Button';

const Container = styled.div({
    backgroundColor: theme.palette.main.background,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
})

const Logo = styled.div({
    border: '1px solid #000',
    padding: '10px',
    alignContent: 'center',
    textAlign: 'center',
    borderRadius: '10px',
    width: '290px',
    height: '70px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: '100px',
    fontSize: '40px',
    background: '#3727fe',
    color: '#FFF'
})

const OptionContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    height: '200px',
    marginBottom: 'auto',
})

function Home() {

    let navigate = useNavigate();

    return (
        <Container>
            <Logo>LOGO</Logo>
            <OptionContainer>
                <ButtonCustom onClick={() => navigate('/konfiguracja')}>Zacznij rozgrywkę</ButtonCustom>
                <ButtonCustom>Raporty</ButtonCustom>
                <ButtonCustom >Wyjdź</ButtonCustom>
            </OptionContainer>
        </Container>
    );
}

export default Home;
