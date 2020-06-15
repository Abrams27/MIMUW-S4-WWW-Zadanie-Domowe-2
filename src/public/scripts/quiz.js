import { Properties } from "./main/properties/properties.js";
import { QuizProperties } from "./main/properties/quizProperties.js";
import { DocumentEditor, SelectEditor } from "./main/editors/documentEditors.js";
import { Quizzes } from "./main/quizzes/quizzes.js";
import { ScoreboardTableEditor } from "./main/editors/quizEditors.js";
import { IndexedDBClient } from "./main/persistence/indexedDBClient.js";
const documentEditor = DocumentEditor.fromDocument(document);
const quizzes = new Quizzes();
const quizzesNamesArray = quizzes.getQuizzesNames();
const selectEditor = new SelectEditor(document, QuizProperties.QUIZ_SELECTION_SELECT_ID);
selectEditor.addOptions(quizzesNamesArray, QuizProperties.QUIZ_SELECTION_SELECT_OPTION_ID);
const scoreboardTableEditor = new ScoreboardTableEditor(document, QuizProperties.QUIZ_SCOREBOARD_TABLE_ID, QuizProperties.QUIZ_SCOREBOARD_NUMBER_OF_SCOREBOARD_ROWS);
let scoreTableScoresUpdater = (quizScoresArray) => scoreboardTableEditor.addRowsWithScoresInGivenOrder(quizScoresArray.sort((a, b) => a.compare(b)));
IndexedDBClient.getAllScoresAndInsertToTableWithSupplier(scoreTableScoresUpdater);
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
