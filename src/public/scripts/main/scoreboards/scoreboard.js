import { QuizDetailedScoreboardGuard } from '../typeguards/typeguards.js';
export class QuizDetailedScoreboard {
    constructor(questionsStatistics) {
        this.questionsStatistics = questionsStatistics;
        this.quizScore = new QuizScore(this.calculateResultWithPenalties());
    }
    static fromQuizQuestionWithAnswersAndTime(questionsListWithUserAnswers) {
        return new QuizDetailedScoreboard(this.mapQuizQuestionWithAnswersAndTime(questionsListWithUserAnswers));
    }
    static fromJson(quizDetailedScoreboardJson) {
        const parsedQuizDetailedScoreboardJson = JSON.parse(quizDetailedScoreboardJson);
        if (QuizDetailedScoreboardGuard.check(parsedQuizDetailedScoreboardJson)) {
            const questionsStatistics = this.copyOfQuestionStatisticsArray(parsedQuizDetailedScoreboardJson.questionsStatistics);
            return new QuizDetailedScoreboard(questionsStatistics);
        }
        else {
            throw new Error('invalid scoreboard json format');
        }
    }
    static copyOfQuestionStatisticsArray(questionsStatistics) {
        return questionsStatistics
            .map(questionStatistics => QuestionStatistics.copyOf(questionStatistics));
    }
    toJson() {
        return JSON.stringify(this);
    }
    getNumericQuizScore() {
        return this.quizScore.getScore();
    }
    getQuizScore() {
        return this.quizScore;
    }
    getQuestionsStatistics() {
        return this.questionsStatistics;
    }
    getNumberOfCorrectsAnswers() {
        return this.questionsStatistics
            .map(questionStatistics => questionStatistics.isAnswerCorrect())
            .map(isAnswerCorrect => Number(isAnswerCorrect))
            .reduce((sum, isCorrect) => sum + isCorrect);
    }
    getNumberOfAnswers() {
        return this.questionsStatistics.length;
    }
    static mapQuizQuestionWithAnswersAndTime(questionsListWithUserAnswers) {
        return QuizQuestionWithAnswersAndTimeMapper
            .mapToQuestionStatisticsArray(questionsListWithUserAnswers);
    }
    calculateResultWithPenalties() {
        return this.questionsStatistics
            .map(questionStatistics => questionStatistics.getTimeWithPenalty())
            .reduce((sum, score) => sum + score);
    }
}
export class QuestionStatistics {
    constructor(isAnswerCorrect, timePenalty, timeSpendInSeconds) {
        this.isAnswerCorrectFlag = isAnswerCorrect;
        this.timePenalty = timePenalty;
        this.timeSpendInSeconds = timeSpendInSeconds;
    }
    static copyOf(questionStatistics) {
        return new QuestionStatistics(questionStatistics.isAnswerCorrectFlag, questionStatistics.timePenalty, questionStatistics.timeSpendInSeconds);
    }
    isAnswerCorrect() {
        return this.isAnswerCorrectFlag;
    }
    getAnswerTime() {
        return this.timeSpendInSeconds;
    }
    getTimePenalty() {
        return this.timePenalty;
    }
    getTimeWithPenalty() {
        if (this.isAnswerCorrectFlag) {
            return this.timeSpendInSeconds;
        }
        else {
            return this.timeSpendInSeconds + this.timePenalty;
        }
    }
}
export class QuizPercentageTimeDetailedScoreboard {
    constructor(questionPercentageTimeStatistics, quizScore) {
        this.questionPercentageTimeStatistics = questionPercentageTimeStatistics;
        this.quizScore = quizScore;
    }
    static fromQuizDetailedScoreboard(quizDetailedScoreboard) {
        const questionPercentageTimeStatistic = QuizPercentageTimeDetailedScoreboard.mapQuestionPercentageTimeStatistics(quizDetailedScoreboard.getQuestionsStatistics());
        const quizScore = quizDetailedScoreboard.getQuizScore();
        return new QuizPercentageTimeDetailedScoreboard(questionPercentageTimeStatistic, quizScore);
    }
    static mapQuestionPercentageTimeStatistics(questionsStatistics) {
        const whileTime = QuizPercentageTimeDetailedScoreboard.calculateWhileTime(questionsStatistics);
        return questionsStatistics
            .map(questionsStatistic => QuestionPercentageTimeStatistics.fromQuestionStatistics(questionsStatistic, whileTime));
    }
    static calculateWhileTime(questionsStatistics) {
        return questionsStatistics
            .map(questionsStatistic => questionsStatistic.getAnswerTime())
            .reduce((value, sum) => sum + value);
    }
    toJson() {
        return JSON.stringify(this);
    }
}
export class QuestionPercentageTimeStatistics {
    constructor(isAnswerCorrect, timePenalty, timeSpendPercentage) {
        this.isAnswerCorrectFlag = isAnswerCorrect;
        this.timePenalty = timePenalty;
        this.timeSpendPercentage = timeSpendPercentage;
    }
    static fromQuestionStatistics(questionStatistics, wholeTime) {
        const timeSpendPercentage = QuestionPercentageTimeStatistics
            .calculateTimeSpendPercentage(questionStatistics.getAnswerTime(), wholeTime);
        return new QuestionPercentageTimeStatistics(questionStatistics.isAnswerCorrect(), questionStatistics.getTimePenalty(), timeSpendPercentage);
    }
    static calculateTimeSpendPercentage(timeSpendInSeconds, wholeTime) {
        return timeSpendInSeconds * 100 / wholeTime;
    }
}
export class QuizScore {
    constructor(score) {
        this.score = score;
    }
    getScore() {
        return this.score;
    }
    static copyOf(quizScore) {
        return new QuizScore(quizScore.score);
    }
    compare(quizScore) {
        if (this.score < quizScore.score) {
            return -1;
        }
        else if (this.score > quizScore.score) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
class QuizQuestionWithAnswersAndTimeMapper {
    static mapToQuestionStatisticsArray(quizQuestionWithAnswersAndTimeArray) {
        return quizQuestionWithAnswersAndTimeArray
            .map(quizQuestionWithAnswersAndTime => this.mapToQuestionStatistics(quizQuestionWithAnswersAndTime));
    }
    static mapToQuestionStatistics(quizQuestionWithAnswersAndTime) {
        const isAnswerCorrect = quizQuestionWithAnswersAndTime.isUserAnswerCorrect();
        const wrongAnswerPenalty = quizQuestionWithAnswersAndTime.getWrongAnswerPenalty();
        const answerTimeInSeconds = quizQuestionWithAnswersAndTime.getUserAnswerTime();
        return new QuestionStatistics(isAnswerCorrect, wrongAnswerPenalty, answerTimeInSeconds);
    }
}
