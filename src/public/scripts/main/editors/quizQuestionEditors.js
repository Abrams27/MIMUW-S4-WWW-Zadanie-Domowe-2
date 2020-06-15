import { HTMLElementEditor } from "./documentEditors.js";
import { QuizQuestionProperties } from "../properties/quizQuestionProperties.js";
import { Utils } from "../utils/utils.js";
export class CurrentQuizSessionPageEditor {
    constructor(document, quizSession) {
        this.quizSession = quizSession;
        this.currentPageLoadTime = 0;
        this.currentQuestionAnswerTimeOnLoad = 0;
        this.paragraphEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_INTRODUCTION_PARAGRAPH_ID);
        this.labelEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_ANSWER_LABEL_ID);
        this.questionInfoTableQuestionNumberEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_INFO_TABLE_QUESTION_NUMBER_ID);
        this.questionInfoTableAllQuestionsNumberEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_INFO_TABLE_ALL_QUESTIONS_NUMBER_ID);
        this.questionInfoTableQuizPageTimeEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_INFO_TABLE_QUIZ_PAGE_TIME_ID);
        this.questionInfoTableQuizTimeEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_INFO_TABLE_QUIZ_TIME_ID);
        this.questionInfoTableTimePenaltyEditor = new HTMLElementEditor(document, QuizQuestionProperties.QUIZ_QUESTION_INFO_TABLE_TIME_PENALTY_ID);
    }
    loadCurrentQuizSessionPage() {
        this.updateCurrentPageTimesOnLoad();
        this.updateCurrentQuestionStopwatch(this.currentPageLoadTime);
        this.loadCurrentQuizSessionPageQuizIntroduction();
        this.loadCurrentQuizSessionPageLabelText();
        this.loadCurrentQuizSessionPageQuestionNumber();
        this.loadCurrentQuizSessionPageNumberOfAllQuestions();
        this.loadCurrentQuizSessionPageWrongAnswerPenalty();
    }
    updateQuizSessionTime(newStopwatchValue) {
        const formattedNewStopwatchValue = Utils.getStringDescriptingTimeInSeconds(newStopwatchValue);
        this.quizSession.updateSessionAnswersTime(newStopwatchValue);
        this.questionInfoTableQuizTimeEditor.setInnerHTML(formattedNewStopwatchValue);
    }
    updateCurrentQuestionStopwatch(newStopwatchValue) {
        const realQuestionAnswerTime = this.currentQuestionAnswerTimeOnLoad - this.currentPageLoadTime + newStopwatchValue;
        const formattedNewStopwatchValue = Utils.getStringDescriptingTimeInSeconds(realQuestionAnswerTime);
        this.quizSession.updateUserAnswerTimeForCurrentQuestion(realQuestionAnswerTime);
        this.questionInfoTableQuizPageTimeEditor.setInnerHTML(formattedNewStopwatchValue);
    }
    updateCurrentPageTimesOnLoad() {
        this.currentPageLoadTime = this.quizSession.getSessionAnswersTime();
        this.currentQuestionAnswerTimeOnLoad = this.quizSession.getUserAnswerTimeForCurrentQuestion();
    }
    loadCurrentQuizSessionPageQuizIntroduction() {
        const quizIntroduction = this.quizSession.getQuizIntroduction();
        this.paragraphEditor.setInnerHTML(quizIntroduction);
    }
    loadCurrentQuizSessionPageLabelText() {
        const actualQuizQuestionText = this.quizSession.getCurrentQuestionText();
        const formattedActualQuizQuestionText = `${actualQuizQuestionText}:</br>`;
        this.labelEditor.setInnerHTML(formattedActualQuizQuestionText);
    }
    loadCurrentQuizSessionPageQuestionNumber() {
        const actualQuizQuestionNumber = this.quizSession.getCurrentQuestionIndex();
        const formattedActualQuizQuestionNumber = `${actualQuizQuestionNumber}`;
        this.questionInfoTableQuestionNumberEditor.setInnerHTML(formattedActualQuizQuestionNumber);
    }
    loadCurrentQuizSessionPageNumberOfAllQuestions() {
        const actualQuizNumberOfAllQuestions = this.quizSession.getNumberOfAllQuestions();
        const formattedActualQuizNumberOfAllQuestions = `${actualQuizNumberOfAllQuestions}`;
        this.questionInfoTableAllQuestionsNumberEditor.setInnerHTML(formattedActualQuizNumberOfAllQuestions);
    }
    loadCurrentQuizSessionPageWrongAnswerPenalty() {
        const actualQuizQuestionWrongAnswerPenalty = this.quizSession.getCurrentQuestionPenalty();
        const formattedActualQuizQuestionWrongAnswerPenalty = `${actualQuizQuestionWrongAnswerPenalty}`;
        this.questionInfoTableTimePenaltyEditor.setInnerHTML(formattedActualQuizQuestionWrongAnswerPenalty);
    }
}
let CurrentQuizSessionPageEditorStopwatch = /** @class */ (() => {
    class CurrentQuizSessionPageEditorStopwatch {
        constructor(currentQuizSessionPageUpdater) {
            this.currentQuizSessionPageUpdater = currentQuizSessionPageUpdater;
            this.counter = 0;
        }
        static forUpdaterAndStart(currentQuizSessionPageUpdater) {
            const stopwatch = new CurrentQuizSessionPageEditorStopwatch(currentQuizSessionPageUpdater);
            stopwatch.start();
            return stopwatch;
        }
        start() {
            this.timer();
        }
        count() {
            this.counter++;
            this.currentQuizSessionPageUpdater.updateQuizSessionTime(this.counter);
            this.currentQuizSessionPageUpdater.updateCurrentQuestionStopwatch(this.counter);
            this.timer();
        }
        timer() {
            setTimeout(() => this.count(), CurrentQuizSessionPageEditorStopwatch.STOPWATCH_TIMEOUT_IM_MS);
        }
    }
    CurrentQuizSessionPageEditorStopwatch.STOPWATCH_TIMEOUT_IM_MS = 1000;
    return CurrentQuizSessionPageEditorStopwatch;
})();
export { CurrentQuizSessionPageEditorStopwatch };
