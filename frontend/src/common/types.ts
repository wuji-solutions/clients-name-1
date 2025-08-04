interface Answer {
    id: string;
    content: string;
}

export interface QuestionStats {
    answers: Array<{ answer: Answer; count: number }>;
}

export interface Question {
    id: string;
    category: string;
    type: string;
    task: string;
    answers: Array<Answer>;
}
