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

const getCurrentQuestion = (user: string, mode: string) => {
    return axios.get(
        user === 'admin'
            ? BACKEND_ENDPOINT + `/games/${mode}/questions/current`
            : BACKEND_ENDPOINT_EXTERNAL + `/games/${mode}/questions/current`
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
    return axios.post(
        BACKEND_ENDPOINT + `/games/${mode}/questions/end`,
        {}
    );
};

export const service = {
    startLobby: startLobby,
    joinGame: joinGame,
    startGame: startGame,
    getCurrentQuestion: getCurrentQuestion,
    sendAnswer: sendAnswer,
    endQuestion: endQuestion,
};
