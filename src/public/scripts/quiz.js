import { Properties } from './main/properties/properties.js';
import { QuizProperties } from './main/properties/quizProperties.js';
import { DocumentEditor, SelectEditor } from './main/editors/documentEditors.js';
import { ScoreboardTableEditor } from './main/editors/quizEditors.js';
import { QuizScore } from './main/scoreboards/scoreboard.js';
import { HttpClient } from './main/httpclient/httpClient.js';
const documentEditor = DocumentEditor.fromDocument(document);
const httpClient = new HttpClient();
const selectEditor = new SelectEditor(document, QuizProperties.QUIZ_SELECTION_SELECT_ID);
const scoreboardTableEditor = new ScoreboardTableEditor(document, QuizProperties.QUIZ_SCOREBOARD_TABLE_ID, QuizProperties.QUIZ_SCOREBOARD_NUMBER_OF_SCOREBOARD_ROWS);
const statsSelectEditor = new SelectEditor(document, QuizProperties.QUIZ_STATS_SELECT_ID);
let chosenQuizName = '';
let chosenQuizStatsQuizName = '';
httpClient.getQuizzesNamesList()
    .then(quizzesNamesArray => updateChosenQuizAndAddOptions(quizzesNamesArray));
function updateChosenQuizAndAddOptions(quizzesNames) {
    chosenQuizName = quizzesNames[0] !== undefined ? quizzesNames[0] : '';
    selectEditor.addOptions(quizzesNames, QuizProperties.QUIZ_SELECTION_SELECT_OPTION_ID);
}
httpClient.getSolvedQuizzesNamesList()
    .then(quizzesNamesArray => updateChosenQuizStatsAndAddOptions(quizzesNamesArray));
function updateChosenQuizStatsAndAddOptions(quizzesNames) {
    chosenQuizStatsQuizName = quizzesNames[0] !== undefined ? quizzesNames[0] : '';
    statsSelectEditor.addOptions(quizzesNames, QuizProperties.QUIZ_SELECTION_SELECT_OPTION_ID);
}
httpClient.getTopScores()
    .then(result => mapScoresAndAddRows(result));
function mapScoresAndAddRows(scores) {
    const mappedAndSortedScores = scores
        .map(o => new QuizScore(o))
        .sort((a, b) => a.compare(b));
    scoreboardTableEditor.addRowsWithScoresInGivenOrder(mappedAndSortedScores, QuizProperties.QUIZ_SCOREBOARD_TABLE_ELEMENT_CLASS);
}
const quizSelectionForm = documentEditor.getElement(QuizProperties.QUIZ_SELECTION_FORM_ID);
quizSelectionForm.addEventListener(Properties.INPUT_TAG, quizSelectionFormInputListener);
const startQuizButton = documentEditor.getElement(QuizProperties.START_QUIZ_BUTTON_ID);
startQuizButton.addEventListener(Properties.CLICK_EVENT_TYPE, startQuizButtonClickListener);
function quizSelectionFormInputListener(event) {
    chosenQuizName = event.target.value;
}
function startQuizButtonClickListener() {
    httpClient.getQuizWithName(chosenQuizName)
        .then(quiz => setQuizAndRedirect(quiz));
}
function setQuizAndRedirect(quiz) {
    sessionStorage.setItem(Properties.QUIZ_SESSION_STORAGE_KEY, quiz);
    location.href = Properties.QUIZ_QUESTION_HTML_FILE;
}
const quizStatsSelectionForm = documentEditor.getElement(QuizProperties.QUIZ_STATS_SELECTION_FORM_ID);
quizStatsSelectionForm.addEventListener(Properties.INPUT_TAG, quizStatsSelectionFormInputListener);
const quizStatsButton = documentEditor.getElement(QuizProperties.QUIZ_STATS_BUTTON_ID);
quizStatsButton.addEventListener(Properties.CLICK_EVENT_TYPE, quizStatsButtonClickListener);
const quizLogoutButton = documentEditor.getElement(QuizProperties.QUIZ_LOGOUT_BUTTON_ID);
quizLogoutButton.addEventListener(Properties.CLICK_EVENT_TYPE, quizLogoutButtonClickListener);
function quizStatsSelectionFormInputListener(event) {
    chosenQuizStatsQuizName = event.target.value;
}
function quizStatsButtonClickListener() {
    sessionStorage.setItem(Properties.QUIZ_NAME_SESSION_STORAGE_KEY, chosenQuizStatsQuizName);
    location.href = Properties.QUIZ_ENDING_HTML_FILE;
}
function quizLogoutButtonClickListener() {
    location.href = Properties.QUIZ_LOGOUT_HTML_FILE;
}
