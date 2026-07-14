export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type AnswerableSession = {
  score: number;
  lives: number;
  answeredCount: number;
  currentQuestionIndex: number;
  startTime: number;
  questions: {
    id: number;
    text: string;
    answers: string[];
    correctIndex: number;
  }[];
};

export function evaluateAnswer(
  session: AnswerableSession,
  answerText: string,
  now = Date.now()
) {
  const currentQuestion = session.questions[session.currentQuestionIndex];
  if (!currentQuestion) return null;

  const isCorrect = answerText === currentQuestion.answers[currentQuestion.correctIndex];
  const score = isCorrect ? session.score + 10 : session.score;
  const lives = isCorrect ? session.lives : session.lives - 1;
  const answeredCount = session.answeredCount + 1;
  const currentQuestionIndex = session.currentQuestionIndex + 1;
  const elapsed = Math.floor((now - session.startTime) / 1000);
  const timeLeft = Math.max(0, 90 - elapsed);
  const gameOver =
    lives <= 0 || timeLeft <= 0 || currentQuestionIndex >= session.questions.length;

  return {
    isCorrect,
    score,
    lives,
    answeredCount,
    currentQuestionIndex,
    timeLeft,
    gameOver,
    correctIndex: currentQuestion.correctIndex,
  };
}
