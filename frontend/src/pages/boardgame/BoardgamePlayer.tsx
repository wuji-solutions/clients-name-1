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
import { boardgameColorPalette, getColor, isMobileView } from '../../common/utils';
import {
  QuestionContainer,
  QuestionHeader,
} from '../quiz/Quiz';
import { ButtonCustom } from '../../components/Button';

const mobile = isMobileView();

export const Container = styled.div(() => ({
  width: '100%',
  height: '100%',
  margin: 'auto',
  overflow: 'hidden',
}));

export const ActionContainer = styled.div(() => ({
  position: 'absolute',
  zIndex: 2,
  margin: 'auto',
  textAlign: 'center',
  top: '25%',
  left: '50%',
  width: 'fit-content',
  height: 'fit-content',
}));

export const GameContainer = styled.div(() => ({
  width: '100%',
  height: 'calc(80vh)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '10px',
  position: 'relative',
  zIndex: 1,
  margin: 'auto',
  boxSizing: 'border-box',
}));

export const BoardQuestionCategory = styled.span(() => ({
  fontSize: mobile ? '20px' : '25px',
  margin: 'auto',
  fontWeight: 'bold',
}));

export const BoardQuestionTask = styled.span(() => ({
  fontSize: mobile ? '25px' : '50px',
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
    categoryColorReferences.set(tile.category, boardgameColorPalette[ i + 2 % boardgameColorPalette.length]);
  })
  return { positions: positions, numfields: positions.length, tileColors: categoryColorReferences, tileStates: data.tileStates.map((entry) => entry.category) };
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
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false);

  const [isAnswering, setIsAnswering] = useState(false);

  const [tileStates, setTileStates] = useState<string[]>();
  const [boardColorReferences, setBoardColorReferences] = useState<Map<string, string | undefined>>();

  useEffect(() => {
    if (!playerIndex) {
      service.getPlayerId().then((response) => {
        setPlayerIndex(response.data.index as string)
        setIsAnswering(response.data.state === 'ANSWERING')
        setShowDice(response.data.state !== 'ANSWERING')
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
        setCurrentQuestion(response.data);
        setSelectedAnswers([]);
        setHasAnsweredQuestion(false);
        setShowAnswerModal(true);
      })
      .catch((error) => {
        console.log(error);
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
          setDiceRoll(false);
          setCheatValue(response.data.diceRoll);
          setPositionUpdateBlock(false);
        }, 1000);
        setTimeout(() => {
          setShowDice(false);
          setDiceInteractable(true);
          getQuestion();
        }, 2000);
      })
      .catch(() => setTimeout(() => { setDiceRoll(false) }, 1000));
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
        selectedAnswers.map((id) => parseInt(id)),
        'board'
      )
      .then((response) => {
        setHasAnsweredQuestion(true);
        setShowAnswerModal(false);
        setHasAnsweredQuestion(true);
        setDiceInteractable(true);
        setShowDice(true);
        setIsAnswering(false);
      })
      .catch((error) => console.error(error));
  };

  const toggleAnswerModal = (mode: 'on' | 'off') => {
    if (mode === 'on') {
      setShowAnswerModal(true);
    } else {
      setShowAnswerModal(false);
    }
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

  return (
    <Container>
      {showAnswerModal && currentQuestion && (
        <Modal>
          <QuestionContainer>
            <QuestionHeader>
              <BoardQuestionCategory>{currentQuestion.category}</BoardQuestionCategory>
              <BoardQuestionTask>{currentQuestion.task}</BoardQuestionTask>
            </QuestionHeader>
            <AnswerGrid>
              {currentQuestion.answers.map((answer, index) => (
                <AnswerCard
                  key={index}
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
