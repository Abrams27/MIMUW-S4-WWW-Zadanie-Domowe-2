import { QuizDetailedScoreboard } from "../scoreboards/scoreboard.js";
export class QuizSession {
    constructor(quiz) {
        this.quiz = quiz;
        this.questionsListWithUserAnswers = quiz.getQuestionsListForUserAnswers();
        this.quizIndex = 0;
        this.sessionAnswersTime = 0;
    }
    static startWithQuiz(quiz) {
        return new QuizSession(quiz);
    }
    getQuizIntroduction() {
        return this.quiz.getIntroduction();
    }
    updateSessionAnswersTime(answersTime) {
        this.sessionAnswersTime = answersTime;
    }
    getSessionAnswersTime() {
        return this.sessionAnswersTime;
    }
    updateUserAnswerTimeForCurrentQuestion(answerTime) {
        this.getCurrentQuestion()
            .updateUserAnswerTime(answerTime);
    }
    getUserAnswerTimeForCurrentQuestion() {
        return this.getCurrentQuestion()
            .getUserAnswerTime();
    }
    loadNextQuestion() {
        if (this.hasNextQuestion()) {
            this.quizIndex++;
        }
    }
    hasNextQuestion() {
        return this.quizIndex + 1 < this.questionsListWithUserAnswers.length;
    }
    loadPreviousQuestion() {
        if (this.hasPreviousQuestion()) {
            this.quizIndex--;
        }
    }
    hasPreviousQuestion() {
        return this.quizIndex - 1 >= 0;
    }
    getCurrentQuestionIndex() {
        return this.quizIndex + 1;
    }
    getNumberOfAllQuestions() {
        return this.questionsListWithUserAnswers.length;
    }
    getCurrentQuestionPenalty() {
        return this.getCurrentQuestion()
            .getWrongAnswerPenalty();
    }
    getCurrentQuestionText() {
        return this.getCurrentQuestion()
            .getQuestionText();
    }
    getCurrentQuestion() {
        return this.questionsListWithUserAnswers[this.quizIndex];
    }
    updateUserAnswerForCurrentQuestion(userAnswer) {
        this.getCurrentQuestion()
            .updateUserAnswer(userAnswer);
    }
    doesUserAnsweredForCurrentQuestion() {
        return this.getCurrentQuestion()
            .doesUserAnswered();
    }
    getUserAnswerForCurrentQuestion() {
        return this.getCurrentQuestion()
            .getUserAnswer();
    }
    removeUserAnswerForCurrentQuestion() {
        this.getCurrentQuestion()
            .removeUserAnswer();
    }
    areAllQuestionsAnswered() {
        return this.questionsListWithUserAnswers
            .every(question => question.doesUserAnswered());
    }
    getDetailedScoreboard() {
        return QuizDetailedScoreboard
            .fromQuizQuestionWithAnswersAndTime(this.questionsListWithUserAnswers);
    }
}
