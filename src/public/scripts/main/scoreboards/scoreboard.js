import { QuizDetailedScoreboardGuard } from '../typeguards/typeguards.js';
export class QuizDetailedScoreboard {
    constructor(questionsStatistics) {
        this.questionsStatistics = questionsStatistics;
        this.quizScore = new QuizScore(this.calculateResultWithPenalties());
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
    constructor(isAnswerCorrect, timePenalty, timeSpendInSeconds, correctAnswer, averageCorrectAnswerTime) {
        this.isAnswerCorrectFlag = isAnswerCorrect;
        this.timePenalty = timePenalty;
        this.timeSpendInSeconds = timeSpendInSeconds;
        this.correctAnswer = correctAnswer;
        this.averageCorrectAnswerTime = averageCorrectAnswerTime;
    }
    static copyOf(questionStatistics) {
        return new QuestionStatistics(questionStatistics.isAnswerCorrectFlag, questionStatistics.timePenalty, questionStatistics.timeSpendInSeconds, questionStatistics.correctAnswer, questionStatistics.averageCorrectAnswerTime);
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
    getCorrectAnswer() {
        return this.correctAnswer;
    }
    getAverageAnswerTime() {
        return this.averageCorrectAnswerTime;
    }
}
export class QuizPercentageTimeDetailedScoreboard {
    constructor(quizName, questionPercentageTimeStatistics) {
        this.quizName = quizName;
        this.questionPercentageTimeStatistics = questionPercentageTimeStatistics;
    }
    static fromQuizQuestionWithAnswersAndTime(quizName, questionsListWithUserAnswers) {
        const questionPercentageTimeStatistic = QuizPercentageTimeDetailedScoreboard.mapQuestionsListWithUserAnswers(questionsListWithUserAnswers);
        return new QuizPercentageTimeDetailedScoreboard(quizName, questionPercentageTimeStatistic);
    }
    static mapQuestionsListWithUserAnswers(questionsListWithUserAnswers) {
        const wholeTime = QuizPercentageTimeDetailedScoreboard.calculateWholeTime(questionsListWithUserAnswers);
        return questionsListWithUserAnswers
            .map(questionsListWithUserAnswer => QuestionPercentageTimeStatistics.fromQuizQuestionWithAnswersAndTime(questionsListWithUserAnswer, wholeTime));
    }
    static calculateWholeTime(questionsListWithUserAnswers) {
        return questionsListWithUserAnswers
            .map(questionsListWithUserAnswer => questionsListWithUserAnswer.getUserAnswerTime())
            .reduce((value, sum) => sum + value);
    }
    toJson() {
        return JSON.stringify(this);
    }
}
export class QuestionPercentageTimeStatistics {
    constructor(answer, timeSpendPercentage) {
        this.answer = answer;
        this.timeSpendPercentage = timeSpendPercentage;
    }
    static fromQuizQuestionWithAnswersAndTime(questionsListWithUserAnswers, wholeTime) {
        const userAnswer = questionsListWithUserAnswers.getUserAnswer();
        const timeSpendPercentage = QuestionPercentageTimeStatistics
            .calculateTimeSpendPercentage(questionsListWithUserAnswers.getUserAnswerTime(), wholeTime);
        return new QuestionPercentageTimeStatistics(userAnswer, timeSpendPercentage);
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
        // const correctAnswr: number = quizQuestionWithAnswersAndTime.
        return new QuestionStatistics(isAnswerCorrect, wrongAnswerPenalty, answerTimeInSeconds, 2137, 1822);
    }
}
