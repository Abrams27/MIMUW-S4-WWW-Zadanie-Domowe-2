import { Properties } from './main/properties/properties.js';
import { QuizProperties } from './main/properties/quizProperties.js';
import { DocumentEditor, SelectEditor } from './main/editors/documentEditors.js';
import { Quizzes } from './main/quizzes/quizzes.js';
import { ScoreboardTableEditor } from './main/editors/quizEditors.js';
import { QuizScore } from './main/scoreboards/scoreboard.js';
import { HttpClient } from './main/httpclient/httpClient.js';
const documentEditor = DocumentEditor.fromDocument(document);
const quizzes = new Quizzes();
const httpClient = new HttpClient();
const selectEditor = new SelectEditor(document, QuizProperties.QUIZ_SELECTION_SELECT_ID);
httpClient.getQuizzesNamesList()
    .then(quizzesNamesArray => selectEditor.addOptions(quizzesNamesArray, QuizProperties.QUIZ_SELECTION_SELECT_OPTION_ID));
const scoreboardTableEditor = new ScoreboardTableEditor(document, QuizProperties.QUIZ_SCOREBOARD_TABLE_ID, QuizProperties.QUIZ_SCOREBOARD_NUMBER_OF_SCOREBOARD_ROWS);
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
    const chosenQuizName = event.target.value;
    quizzes.updateChosenQuiz(chosenQuizName);
}
function startQuizButtonClickListener() {
    const chosenQuiz = quizzes.getChosenQuiz();
    const chosenQuizJson = chosenQuiz.toJson();
    sessionStorage.setItem(Properties.QUIZ_SESSION_STORAGE_KEY, chosenQuizJson);
    location.href = Properties.QUIZ_QUESTION_HTML_FILE;
}
