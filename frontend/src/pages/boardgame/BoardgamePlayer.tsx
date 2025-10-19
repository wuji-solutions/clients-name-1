import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions, Pawn, Question } from '../../common/types';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';
import { service } from '../../service/service';
import { useSSEChannel } from '../../providers/SSEProvider';
import { BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import Dice from '../../components/Dice';
import Modal from '../../components/Modal';
import AnswerCard from '../../components/AnswerCard';
import { boardgameColorPalette, darkenColor, getColor, isMobileView, lightenColor } from '../../common/utils';
import { QuestionContainer, QuestionHeader } from '../quiz/Quiz';
import { ButtonCustom } from '../../components/Button';
import theme from '../../common/theme';

const mobile = isMobileView();

export const Container = styled.div(() => ({
  width: '99%',
  height: '100%',
  margin: 'auto',
  overflow: 'hidden',
}));

const ActionContainer = styled.div(() => ({
  position: 'absolute',
  zIndex: 2,
  margin: 'auto',
  textAlign: 'center',
  top: '10%',
  left: '25%',
  width: 'fit-content',
  height: 'fit-content',
}));

export const GameContainer = styled.div(() => ({
  width: '99%',
  height: 'calc(80vh)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '10px',
  position: 'relative',
  zIndex: 1,
  margin: 'auto',
  boxSizing: 'border-box',
}));

const BoardQuestionCategory = styled.span(() => ({
  fontSize: mobile ? '15px' : '25px',
  margin: 'auto',
  fontWeight: 'bold',
}));

const BoardQuestionTask = styled.span(() => ({
  fontSize: mobile ? '20px' : '50px',
  margin: 'auto',
  fontWeight: 'bold',
}));

const AnswerGrid = styled.div(() => ({
  display: 'grid',
  gridTemplateColumns: mobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
  gap: '35px',
  padding: '40px',
  justifyItems: 'center',
}));

const ToggleModalButton = styled.button({
  width: '32px',
  height: '32px',
  marginLeft: 'auto',
  marginRight: 'auto',
  background: theme.palette.button.primary,
  color: '#FFF',
  border: '0px solid #000',
  borderRadius: '50%',
  boxShadow: `0 3px 0 0 ${darkenColor(theme.palette.button.primary, 0.1)}`,
  '&:hover': {
    background: darkenColor(theme.palette.button.primary, 0.1),
    boxShadow: `0 3px 0 0 ${darkenColor(theme.palette.button.primary, 0.2)}`,
    cursor: 'pointer',
  },
  '-webkit-transition-duration': '0.2s',
  transitionDuration: '0.2s',
  padding: '7px',
  fontSize: '15px',
  fontWeight: '700',

  position: 'absolute',
  right: '20px',
  top: '20px',
  zIndex: '9999',
});


const GameFinishedContainer = styled.div({
  color: lightenColor(theme.palette.main.accent, 0.1),
  textAlign: 'center',
  textShadow: 'none',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
});

function parsePlayerPositions(
  positions: [{ tileIndex: number; players: [Pawn]; category: string }]
) {
  return positions.map((tileState) => tileState.players);
}

function getBoardSetup(data: {
  tileStates: [{ players: [Pawn]; tileIndex: number; category: string }];
}) {
  const positions = parsePlayerPositions(data.tileStates);
  const categoryColorReferences = new Map<string, string | undefined>();
  data.tileStates.map((tile, i) => {
    if (tile.category in categoryColorReferences) return;
    categoryColorReferences.set(
      tile.category,
      boardgameColorPalette[i % boardgameColorPalette.length]
    );
  });
  return {
    positions: positions,
    numfields: positions.length,
    tileColors: categoryColorReferences,
    tileStates: data.tileStates.map((entry) => entry.category),
  };
}

function SSEOnBoardgameStateChangeListener({ setPositions }: { setPositions: Function }) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT_EXTERNAL + '/sse/board/new-state', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('new-board-state', (data) => {
      setPositions(parsePlayerPositions(data.tileStates));
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function SSEOnEventListener({ setGameFinished }: { setGameFinished: Function }) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT_EXTERNAL + '/sse/events', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('game-finish', () => {
      setGameFinished(true);
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function BoardgamePlayer() {
  const [positionsBuffer, setPositionsBuffer] = useState<BoardPositions>([]);
  const [positions, setPositions] = useState<BoardPositions>([]);
  const [numfields, setNumfields] = useState<number>(0);
  const { ref: gameContainerRef, dimensions } = useContainerDimensions();
  const [playerIndex, setPlayerIndex] = useState<string | undefined>(undefined);
  const [diceRoll, setDiceRoll] = useState<boolean | undefined>(undefined);
  const [cheatValue, setCheatValue] = useState<'1' | '2' | '3' | '4' | '5' | '6' | undefined>(
    undefined
  );
  const [positionUpdateBlock, setPositionUpdateBlock] = useState<boolean>(false);
  const [diceInteractable, setDiceInteractable] = useState<boolean>(true);
  const [showDice, setShowDice] = useState<boolean>(false);

  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);

  const [isAnswering, setIsAnswering] = useState(false);

  const [tileStates, setTileStates] = useState<string[]>();
  const [boardColorReferences, setBoardColorReferences] =
    useState<Map<string, string | undefined>>();

  const [playerPoints, setPlayerPoints] = useState<number>();

  const [gameFinished, setGameFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!playerIndex) {
      service.getPlayerId().then((response) => {
        setPlayerIndex(response.data.index as string);
        setIsAnswering(response.data.state === 'ANSWERING');
        setShowDice(response.data.state !== 'ANSWERING');
        setPlayerPoints(response.data.points);
      });
    }
  }, []);

  useEffect(() => {
    if (!currentQuestion && isAnswering) {
      setShowDice(false);
      getQuestion();
    }
  }, [isAnswering]);

  useEffect(() => {
    service.getBoardState('user').then((response) => {
      const setup = getBoardSetup(response.data);
      setPositions(setup.positions);
      setNumfields(setup.numfields);
      setTileStates(setup.tileStates);
      setBoardColorReferences(setup.tileColors);
    });
  }, []);

  useEffect(() => {
    if (!positionUpdateBlock) setPositions(positionsBuffer);
  }, [positionsBuffer, positionUpdateBlock]);

  const getQuestion = () => {
    service
      .getCurrentQuestion('user', 'board')
      .then((response) => {
        setIsAnswering(true);
        setCurrentQuestion(response.data);
        setSelectedAnswers([]);
        setTimeout(() => {
          setShowAnswerModal(true);
        }, 2000)
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 409) {
          setGameFinished(true);
          return;
        }
        setDiceInteractable(true);
        setShowDice(true);
      });
  };

  const rollDice = () => {
    if (!diceInteractable) return;
    setPositionUpdateBlock(true);
    toggleDiceRoll('on');
    service
      .makeMove()
      .then((response) => {
        setTimeout(() => {
          setCheatValue(response.data.diceRoll);
        }, 1000);
        setTimeout(() => {
          setDiceRoll(false);
        }, 1500);
        setTimeout(() => {
          setDiceInteractable(true);
          getQuestion();
          setPositionUpdateBlock(false);
        }, 2000);
        setTimeout(() => {
          setShowDice(false);
        }, 3000);
      })
      .catch(() =>
        setTimeout(() => {
          setDiceRoll(false);
        }, 1000)
      );
  };

  const handleAnswerSelected = (id: string) => {
    setSelectedAnswers((prevState) => {
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
    service
      .sendAnswer(
        selectedAnswers.map((id) => Number.parseInt(id)),
        'board'
      )
      .then((response) => {
        const answerCorrect = response.data;
        setIsAnswering(false);
        setShowAnswerModal(false);
        setDiceInteractable(true);
        setShowDice(true);
        setIsAnswering(false);
      })
      .catch((error) => console.error(error));
  };

  const toggleDiceRoll = (mode: 'on' | 'off') => {
    if (mode === 'on') {
      setCheatValue(undefined);
      setDiceInteractable(false);
      setDiceRoll(true);
    } else {
      setDiceInteractable(true);
      setDiceRoll(false);
    }
  };

  const toggleAnswerModal = () => {
    if (showAnswerModal) {
      setModalClosing(true);
      setTimeout(() => {
        setModalClosing(false);
        setShowAnswerModal(false);
      }, 500)
    } else {
      setShowAnswerModal(true);
    }
  }

  if (gameFinished) {
    return (
    <Container style={{height: '80vh'}}>
      <GameFinishedContainer>
          Gra się zakończyła
        </GameFinishedContainer>
    </Container>
    )
  };

  return (
    <Container>
      <SSEOnEventListener setGameFinished={setGameFinished} />
      {isAnswering && (
        <ToggleModalButton onClick={toggleAnswerModal} disabled={modalClosing}>
          {showAnswerModal ? '^' : 'v'}
        </ToggleModalButton>
      )}
      {showAnswerModal && currentQuestion && (
        <Modal isClosing={modalClosing}>
          <QuestionContainer>
            <QuestionHeader>
              <BoardQuestionCategory>{currentQuestion.category}</BoardQuestionCategory>
              <BoardQuestionTask>{currentQuestion.task}</BoardQuestionTask>
            </QuestionHeader>
            <AnswerGrid>
              {currentQuestion.answers.map((answer, index) => (
                <AnswerCard
                  key={`answer_${index}`}
                  isselected={selectedAnswers.includes(answer.id)}
                  backgroundcolor={getColor(index)}
                  onClick={() => handleAnswerSelected(answer.id)}
                >
                  <h2>{answer.text}</h2>
                </AnswerCard>
              ))}
            </AnswerGrid>
            <ButtonCustom onClick={() => handleAnswerSent()}>Wyślij odpowiedź</ButtonCustom>
          </QuestionContainer>
        </Modal>
      )}
      <SSEOnBoardgameStateChangeListener setPositions={setPositionsBuffer} />
      <ActionContainer onClick={rollDice}>
        {showDice && <Dice diceRoll={diceRoll} cheatValue={cheatValue} />}
      </ActionContainer>
      <GameContainer ref={gameContainerRef}>
        {dimensions.width > 0 && numfields && (
          <GameBoard
            positions={positions}
            width={dimensions.width}
            height={dimensions.height}
            numFields={numfields}
            storedPlayerIndex={playerIndex}
            positionUpdateBlock={positionUpdateBlock}
            boardColorReferences={boardColorReferences}
            tileStates={tileStates}
          />
        )}
      </GameContainer>
    </Container>
  );
}

export default BoardgamePlayer;
