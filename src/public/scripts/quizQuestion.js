import { Properties } from './main/properties/properties.js';
import { Quiz } from './main/quizzes/quizzes.js';
import { Utils } from './main/utils/utils.js';
import { DocumentEditor } from './main/editors/documentEditors.js';
import { QuizSession } from './main/quizzes/quizSession.js';
import { CurrentQuizSessionPageEditor, CurrentQuizSessionPageEditorStopwatch } from './main/editors/quizQuestionEditors.js';
import { QuizQuestionProperties } from './main/properties/quizQuestionProperties.js';
import { HttpClient } from './main/httpclient/httpClient.js';
const httpClient = new HttpClient();
const documentEditor = DocumentEditor.fromDocument(document);
const crsfCookie = documentEditor.getCookie(Properties.CRSF_COOKIE_NAME);
console.log(crsfCookie);
const nullableQuizJson = sessionStorage.getItem(Properties.QUIZ_SESSION_STORAGE_KEY);
const quizJson = Utils.getStringOrThrowError(nullableQuizJson, 'invalid session storage key');
const quiz = Quiz.fromJson(quizJson);
const quizSession = QuizSession.startWithQuiz(quiz);
const currentQuizSessionPageUpdater = new CurrentQuizSessionPageEditor(document, quizSession);
CurrentQuizSessionPageEditorStopwatch.forUpdaterAndStart(currentQuizSessionPageUpdater);
const answerInput = documentEditor.getElement(QuizQuestionProperties.QUIZ_QUESTION_ANSWER_INPUT_ID);
answerInput.addEventListener(Properties.INPUT_EVENT_TYPE, answerInputListener);
answerInput.placeholder = QuizQuestionProperties.QUIZ_QUESTION_ANSWER_INPUT_PLACEHOLDER;
const cancelButton = documentEditor.getElement(QuizQuestionProperties.QUIZ_QUESTION_CANCEL_BUTTON_ID);
cancelButton.addEventListener(Properties.CLICK_EVENT_TYPE, cancelButtonClickListener);
const navigationBackButton = documentEditor.getElement(QuizQuestionProperties.QUIZ_QUESTION_NAVIGATION_BACK_BUTTON_ID);
navigationBackButton.addEventListener(Properties.CLICK_EVENT_TYPE, navigationBackButtonClickListener);
const navigationStopButton = documentEditor.getElement(QuizQuestionProperties.QUIZ_QUESTION_NAVIGATION_STOP_BUTTON_ID);
navigationStopButton.addEventListener(Properties.CLICK_EVENT_TYPE, navigationStopButtonClickListener);
const navigationNextButton = documentEditor.getElement(QuizQuestionProperties.QUIZ_QUESTION_NAVIGATION_NEXT_BUTTON_ID);
navigationNextButton.addEventListener(Properties.CLICK_EVENT_TYPE, navigationNextButtonClickListener);
updateButtonsVisibilityIfNeededAndUpdatePage();
function answerInputListener(event) {
    const insertedValue = event.target.value;
    if (insertedValue.length > 0) {
        updateUserAnswer(insertedValue);
    }
    else {
        removeUserAnswer();
    }
    updateButtonsVisibilityIfNeededAndUpdatePage();
}
function updateUserAnswer(userAnswer) {
    const parsedUserAnswer = Number(userAnswer);
    quizSession.updateUserAnswerForCurrentQuestion(parsedUserAnswer);
}
function removeUserAnswer() {
    quizSession.removeUserAnswerForCurrentQuestion();
}
function cancelButtonClickListener() {
    sessionStorage.removeItem(Properties.QUIZ_SESSION_STORAGE_KEY);
    // todo tutaj tez cos!!!
    location.href = Properties.QUIZ_HTML_FILE;
}
function navigationBackButtonClickListener() {
    quizSession.loadPreviousQuestion();
    updateAnswerInputValue();
    updateButtonsVisibilityIfNeededAndUpdatePage();
}
function navigationStopButtonClickListener() {
    const quizPercentageTimeDetailedScoreboard = quizSession.getQuizPercentageTimeDetailedScoreboard();
    const quizPercentageTimeDetailedScoreboardJson = quizPercentageTimeDetailedScoreboard.toJson();
    // todo obsluga?
    httpClient.postQuizResults(quiz.getName(), quizPercentageTimeDetailedScoreboardJson, crsfCookie)
        .then(_ => postQuizResultsAndRedirect(quizPercentageTimeDetailedScoreboardJson));
}
function postQuizResultsAndRedirect(quizDetaildedScoreboardJson) {
    sessionStorage.removeItem(Properties.QUIZ_SESSION_STORAGE_KEY);
    sessionStorage.setItem(Properties.QUIZ_NAME_SESSION_STORAGE_KEY, quiz.getName());
    location.href = Properties.QUIZ_ENDING_HTML_FILE;
}
function navigationNextButtonClickListener() {
    quizSession.loadNextQuestion();
    updateAnswerInputValue();
    updateButtonsVisibilityIfNeededAndUpdatePage();
}
function updateButtonsVisibilityIfNeededAndUpdatePage() {
    updateButtonsVisibilityIfNeeded();
    currentQuizSessionPageUpdater.loadCurrentQuizSessionPage();
}
function updateButtonsVisibilityIfNeeded() {
    updateNavigationBackButtonVisibilityIfNeeded();
    updateNavigationNextButtonVisibilityIfNeeded();
    updateNavigationStopButtonVisibilityIfNeeded();
}
function updateNavigationBackButtonVisibilityIfNeeded() {
    if (quizSession.hasPreviousQuestion()) {
        navigationBackButton.removeAttribute(Properties.DISABLED_ATTRIBUTE);
    }
    else {
        navigationBackButton.setAttribute(Properties.DISABLED_ATTRIBUTE, Properties.TRUE);
    }
}
function updateNavigationNextButtonVisibilityIfNeeded() {
    if (quizSession.hasNextQuestion()) {
        navigationNextButton.removeAttribute(Properties.DISABLED_ATTRIBUTE);
    }
    else {
        navigationNextButton.setAttribute(Properties.DISABLED_ATTRIBUTE, Properties.TRUE);
    }
}
function updateNavigationStopButtonVisibilityIfNeeded() {
    if (quizSession.areAllQuestionsAnswered()) {
        navigationStopButton.removeAttribute(Properties.DISABLED_ATTRIBUTE);
    }
    else {
        navigationStopButton.setAttribute(Properties.DISABLED_ATTRIBUTE, Properties.TRUE);
    }
}
function updateAnswerInputValue() {
    answerInput.value = getUserAnswerForCurrentQuestionOrEmpty();
}
function getUserAnswerForCurrentQuestionOrEmpty() {
    if (quizSession.doesUserAnsweredForCurrentQuestion()) {
        return String(quizSession.getUserAnswerForCurrentQuestion());
    }
    else {
        return '';
    }
}
