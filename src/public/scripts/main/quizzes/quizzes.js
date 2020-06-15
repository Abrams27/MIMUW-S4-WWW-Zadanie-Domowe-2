import { quizzesArray } from "../../resources/quizzesConfig.js";
import { QuizGuard } from "../typeguards/typeguards.js";
export class Quizzes {
    constructor() {
        this.quizzes = this.parseQuizzesJsonsArray(quizzesArray);
        this.validateQuizzesArrayLength();
        this.chosenQuiz = this.quizzes[0];
    }
    validateQuizzesArrayLength() {
        if (this.quizzes.length == 0) {
            throw new Error("no quizzes added");
        }
    }
    getQuizzesNames() {
        return this.quizzes
            .map(quiz => quiz.getName());
    }
    getChosenQuiz() {
        return this.chosenQuiz;
    }
    updateChosenQuiz(quizName) {
        this.chosenQuiz = this.findQuiz(quizName);
    }
    findQuiz(quizName) {
        const quiz = this.quizzes
            .find(quiz => quiz.hasName(quizName));
        if (quiz == undefined) {
            throw new Error("invalid quiz name");
        }
        return quiz;
    }
    parseQuizzesJsonsArray(quizzesJsonsArray) {
        return quizzesJsonsArray
            .map(json => Quiz.fromJson(json));
    }
}
export class Quiz {
    constructor(quizJson) {
        this.quizJson = quizJson;
    }
    static fromJson(quizJson) {
        const parsedQuizJson = JSON.parse(quizJson);
        if (QuizGuard.check(parsedQuizJson)) {
            return new Quiz(parsedQuizJson);
        }
        else {
            throw new Error("invalid quiz json format");
        }
    }
    toJson() {
        return JSON.stringify(this.quizJson);
    }
    getName() {
        return this.quizJson.name;
    }
    hasName(name) {
        return this.getName() == name;
    }
    getIntroduction() {
        return this.quizJson.introduction;
    }
    getQuestionsListForUserAnswers() {
        return this.quizJson
            .questionsWithAnswers
            .map(questionJson => QuizQuestionWithAnswersAndTime.fromQuizQuestionWithAnswerJson(questionJson));
    }
}
export class QuizQuestionWithAnswersAndTime {
    constructor(quizQuestionWithAnswerJson) {
        this.quizQuestionWithAnswerJson = quizQuestionWithAnswerJson;
        this.userAnswer = 0;
        this.doesUserAnsweredFlag = false;
        this.answerTime = 0;
    }
    static fromQuizQuestionWithAnswerJson(quizQuestionWithAnswerJson) {
        return new QuizQuestionWithAnswersAndTime(quizQuestionWithAnswerJson);
    }
    updateUserAnswer(userAnswer) {
        this.userAnswer = userAnswer;
        this.doesUserAnsweredFlag = true;
    }
    removeUserAnswer() {
        this.doesUserAnsweredFlag = false;
    }
    updateUserAnswerTime(answerTime) {
        this.answerTime = answerTime;
    }
    getUserAnswerTime() {
        return this.answerTime;
    }
    doesUserAnswered() {
        return this.doesUserAnsweredFlag;
    }
    isUserAnswerCorrect() {
        return this.doesUserAnswered()
            && this.userAnswer == this.quizQuestionWithAnswerJson.answer;
    }
    getQuestionText() {
        return this.quizQuestionWithAnswerJson.question;
    }
    getWrongAnswerPenalty() {
        return this.quizQuestionWithAnswerJson.wrongAnswerPenalty;
    }
    getUserAnswer() {
        return this.userAnswer;
    }
}
