import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from '../common/config';
import { useState } from 'react';
import { Question } from '../common/types';

const USER_QUIZ_SSE_ENDPOINT_EXTERNAL = BACKEND_ENDPOINT_EXTERNAL + '/sse/quiz/events';

type EventType = 'next-question' | 'answer-counter';

export const [question, setQuestion] = useState<Question>();
export const [answerCounter, setAnswerCounter] = useState<number>(0);

interface SSEEvent {
    name: string;
    data: any;
}

const handleSSEConnection = (url: string, onMessage: (event: MessageEvent<any>) => void) => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
        onMessage(event);
    };

    eventSource.onerror = (error) => {
        console.error('SSE error: ', error);
        eventSource.close();
    };

    return () => {
        eventSource.close();
    };
};

export const userSSE = () => {
    return handleSSEConnection(USER_QUIZ_SSE_ENDPOINT_EXTERNAL, delegateUserMessage);
};

const delegateUserMessage = (event: MessageEvent<SSEEvent>) => {
    const name = event.data.name as EventType;
    switch (name) {
        case 'next-question':
            fetchNextQuestion(event.data.data);
            break;
        case 'answer-counter':
            updateAnswerCounter(event.data.data);
            break;
    }
};

const fetchNextQuestion = (data: any) => {
    // TODO: add parsing?
    setQuestion(data);
    setAnswerCounter(0); // propably
};

const updateAnswerCounter = (data: any) => {
    setAnswerCounter(data);
};
