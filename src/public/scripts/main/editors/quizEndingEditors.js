import { HTMLElementEditor, QuizScoreboardTableEditor } from "./documentEditors.js";
import { QuizEndingProperties } from "../properties/quizEndingProperties.js";
import { Utils } from "../utils/utils.js";
export class QuizEndingPageEditor {
    constructor(document, detailedScoreboard) {
        this.detailedScoreboard = detailedScoreboard;
        this.quizStatsAnswerEditor = new HTMLElementEditor(document, QuizEndingProperties.QUIZ_ENDING_STATS_TABLE_ANSWERS_ID);
        this.quizStatsResultEditor = new HTMLElementEditor(document, QuizEndingProperties.QUIZ_ENDING_STATS_TABLE_RESULT_ID);
        this.quizDetailsStatsTableEditor = new QuizScoreboardTableEditor(document, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_ID);
    }
    loadPage() {
        this.loadPageQuizStatsAnswer();
        this.loadPageQuizStatsResult();
        this.loadPageDetailsStatsTable();
    }
    loadPageQuizStatsAnswer() {
        const quizStatsNumberOfCorrectAnswers = this.detailedScoreboard.getNumberOfCorrectsAnswers();
        const quizStatsNumberOfAnswers = this.detailedScoreboard.getNumberOfAnswers();
        const formattedQuizStatsAnswer = `${quizStatsNumberOfCorrectAnswers} / ${quizStatsNumberOfAnswers}`;
        this.quizStatsAnswerEditor.setInnerHTML(formattedQuizStatsAnswer);
    }
    loadPageQuizStatsResult() {
        const quizStatsResult = this.detailedScoreboard.getNumericQuizScore();
        const formattedQuizStatsResult = Utils.getStringDescriptingTimeInSeconds(quizStatsResult);
        this.quizStatsResultEditor.setInnerHTML(formattedQuizStatsResult);
    }
    loadPageDetailsStatsTable() {
        this.detailedScoreboard
            .getQuestionsStatistics()
            .forEach(questionStatistics => this.loadPageDetailsStatsTableRow(questionStatistics));
    }
    loadPageDetailsStatsTableRow(questionStatistics) {
        const isAnswerCorrect = questionStatistics.isAnswerCorrect();
        const answerTime = questionStatistics.getAnswerTime();
        const timePenalty = questionStatistics.getTimePenalty();
        this.quizDetailsStatsTableEditor
            .addRowWithAnswerTimeAndPenaltyForQuestion(isAnswerCorrect, answerTime, timePenalty);
    }
}
