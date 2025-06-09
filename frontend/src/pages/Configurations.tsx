import React from 'react';
import ButtonCustom from '../components/Button';
import { useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import theme from '../common/theme';

const Container = styled.div({
    backgroundColor: theme.palette.main.background,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
})

const InstructionContainer = styled.div({
    width: '30%',
    background: '#6666',
    padding: '5px'
})

const InstructionHeader = styled.div({
    margin: 'auto',
    background: theme.palette.main.primary,
    width: '70%',
    height: '50px',
    marginTop: '20px',
    textAlign: 'center',
    alignContent: 'center',
    borderRadius: '5px',
    color: '#fff'
})


const ModeContainer = styled.div({
    width: '40%',
    background: '#1111'
})

const OptionsContainer = styled.div({
    width: '30%',
    background: '#fff'
})

function Configurations() {

    let navigate = useNavigate();

    return (
        <Container>
            <InstructionContainer>
                <InstructionHeader>
                    Instrukcja uruchomienia
                </InstructionHeader>

            </InstructionContainer>
            <ModeContainer>
                <ButtonCustom onClick={() => navigate('/quiz')}>Zacznij grę</ButtonCustom>
            </ModeContainer>
            <OptionsContainer>
                <ButtonCustom onClick={() => navigate('/')}>Powrót</ButtonCustom>
            </OptionsContainer>
        </Container>
    );
}

export default Configurations;
