import axios from 'axios';
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from '../common/config';

const startLobby = (mode: string, quiz: any) => {
  return axios.post(BACKEND_ENDPOINT + '/manage/' + mode, quiz, {
    headers: { 'Content-Type': 'application/json' },
  });
};

const joinGame = (index: number, mode: string) => {
  return axios.post(
    BACKEND_ENDPOINT_EXTERNAL + `/games/${mode}/join`,
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
  return axios.post(BACKEND_ENDPOINT + '/manage/finish');
};

const getGameSummary = () => {
  return axios.get(BACKEND_ENDPOINT + `/games/quiz/summarize`);
};

const getCurrentQuestion = (user: string, mode: string) => {
  return axios.get(
    user === 'admin'
      ? BACKEND_ENDPOINT + `/games/${mode}/questions/current`
      : BACKEND_ENDPOINT_EXTERNAL + `/games/${mode}/questions/current`,
    { withCredentials: true }
  );
};

const sendAnswer = (answers: Array<number>, mode: string, hasCheated?: boolean) => {
  let payload;
  if (hasCheated != undefined) {
    payload = {
      answerIds: answers,
      playerCheated: hasCheated,
    };
  } else {
    payload = {
      answerIds: answers,
    };
  }
  return axios.post(BACKEND_ENDPOINT_EXTERNAL + `/games/${mode}/questions/answer`, payload, {
    withCredentials: true,
  });
};

const endQuestion = (mode: string) => {
  return axios.post(BACKEND_ENDPOINT + `/games/${mode}/questions/end`, { withCredentials: true });
};

const nextQuestion = (mode: string) => {
  return axios.post(BACKEND_ENDPOINT + `/games/${mode}/questions/next`, { withCredentials: true });
};

const nextQuestionExam = () => {
  return axios.get(BACKEND_ENDPOINT_EXTERNAL + `/games/exam/questions/next`, { withCredentials: true });
};

const previousQuestionExam = () => {
  return axios.get(BACKEND_ENDPOINT_EXTERNAL + `/games/exam/questions/previous`, { withCredentials: true });
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

const getBoardState = (user: string) => {
  return axios.get(
    (user === 'admin' ? BACKEND_ENDPOINT : BACKEND_ENDPOINT_EXTERNAL) + '/games/board/state',
    { withCredentials: true }
  );
};

const makeMove = () => {
  return axios.post(
    BACKEND_ENDPOINT_EXTERNAL + '/games/board/player/move',
    {},
    { withCredentials: true }
  );
};

const getPlayerId = () => {
  return axios.get(BACKEND_ENDPOINT_EXTERNAL + '/games/board/player', { withCredentials: true });
};

const getPlayerRanking = () => {
  return axios.get(BACKEND_ENDPOINT + '/games/board/ranking', { withCredentials: true });
};

const getExamTimeRemainingUser = () => {
  return axios.get(BACKEND_ENDPOINT_EXTERNAL + '/games/exam/time-left', { withCredentials: true });
};

const getExamTimeRemainingAdmin = () => {
  return axios.get(BACKEND_ENDPOINT + '/games/exam/time-left', { withCredentials: true });
};

const getModeConfig = () => {
  return axios.get(BACKEND_ENDPOINT + '/manage/config', { withCredentials: true });
};

const parseQuestions = (filePath: string) => {
  return axios.get(BACKEND_ENDPOINT + '/manage/parse-questions', {
    params: { questionsFilePath: filePath },
  });
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
  nextQuestionExam: nextQuestionExam,
  previousQuestionExam: previousQuestionExam,
  kickPlayer: kickPlayer,
  getPlayerList: getPlayerList,
  hasAnsweredQuestion: hasAnsweredQuestion,
  getBoardState: getBoardState,
  makeMove: makeMove,
  getPlayerId: getPlayerId,
  getPlayerRanking: getPlayerRanking,
  getExamTimeRemainingUser: getExamTimeRemainingUser,
  getExamTimeRemainingAdmin: getExamTimeRemainingAdmin,
  getModeConfig: getModeConfig,
  parseQuestions: parseQuestions,
};
