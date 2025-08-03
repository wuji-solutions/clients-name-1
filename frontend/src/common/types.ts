interface Answer {
    id: string,
    content: string,
}

export interface Question {
    id: string,
    category: string,
    type: string,
    task: string,
    answers: Array<Answer>
}