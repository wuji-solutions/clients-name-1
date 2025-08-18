import axios from 'axios';
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from '../common/config';

const startLobby = (mode: string, quiz: any) => {
  return axios.post(BACKEND_ENDPOINT + '/manage/' + mode, quiz, {
    headers: { 'Content-Type': 'application/json' },
  });
};

const joinGame = (index: number) => {
  return axios.post(
    BACKEND_ENDPOINT_EXTERNAL + '/games/quiz/join',
    { index: index },
    {
      withCredentials: true,
    }
  );
};

const startGame = () => {
  return axios.post(BACKEND_ENDPOINT + '/manage/start');
};

const finishGame = () => {
  return axios.post(BACKEND_ENDPOINT + '/finish');
};

const getGameSummary = () => {
  return axios.get(BACKEND_ENDPOINT + '/games/quiz/summarize'); // TODO: CHANGE HARD CODED QUIZ TO SPECIFIC VALUE WHEN MORE GAMES TYPES ARE AVAILABLE
};

const getCurrentQuestion = (user: string, mode: string) => {
  return axios.get(
    user === 'admin'
      ? BACKEND_ENDPOINT + `/games/${mode}/questions/current`
      : BACKEND_ENDPOINT_EXTERNAL + `/games/${mode}/questions/current`,
    { withCredentials: true }
  );
};

const sendAnswer = (answers: Array<number>, mode: string) => {
  return axios.post(
    BACKEND_ENDPOINT_EXTERNAL + `/games/${mode}/questions/answer`,
    {
      answerIds: answers,
    },
    { withCredentials: true }
  );
};

const endQuestion = (mode: string = 'quiz') => {
  return axios.post(BACKEND_ENDPOINT + `/games/${mode}/questions/end`, {});
};

const nextQuestion = (mode: string = 'quiz') => {
  return axios.post(BACKEND_ENDPOINT + `/games/${mode}/questions/next`, {});
};

const kickPlayer = (index: number, nickname: string) => {
  return axios.post(
    BACKEND_ENDPOINT + '/manage/player/kick?index=' + index + '&nickname=' + nickname
  );
};

const getPlayerList = () => {
  return axios.get(BACKEND_ENDPOINT + '/manage/players');
};

const hasAnsweredQuestion = (questionId: number) => {
  return axios.get(
    BACKEND_ENDPOINT_EXTERNAL + `/games/quiz/questions/${questionId}/already-answered`,
    { withCredentials: true }
  );
};

export const service = {
  startLobby: startLobby,
  joinGame: joinGame,
  startGame: startGame,
  finishGame: finishGame,
  getGameSummary: getGameSummary,
  getCurrentQuestion: getCurrentQuestion,
  sendAnswer: sendAnswer,
  endQuestion: endQuestion,
  nextQuestion: nextQuestion,
  kickPlayer: kickPlayer,
  getPlayerList: getPlayerList,
  hasAnsweredQuestion: hasAnsweredQuestion,
};
