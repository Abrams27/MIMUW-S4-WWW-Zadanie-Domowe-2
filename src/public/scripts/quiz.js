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
let chosenQuizName = '';
httpClient.getQuizzesNamesList()
    .then(quizzesNamesArray => updateChosenQuizAndAddOptions(quizzesNamesArray));
function updateChosenQuizAndAddOptions(quizzesNames) {
    chosenQuizName = quizzesNames[0] !== undefined ? quizzesNames[0] : '';
    selectEditor.addOptions(quizzesNames, QuizProperties.QUIZ_SELECTION_SELECT_OPTION_ID);
}
httpClient.getTopScores()
    .then(result => mapScoresAndAddRows(result));
function mapScoresAndAddRows(scores) {
    const mappedAndSortedScores = scores
        .map(o => new QuizScore(o))
        .sort((a, b) => a.compare(b));
    scoreboardTableEditor.addRowsWithScoresInGivenOrder(mappedAndSortedScores);
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
