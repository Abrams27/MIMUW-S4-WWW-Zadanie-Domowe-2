import { Properties } from './main/properties/properties.js';
import { QuizEndingProperties } from './main/properties/quizEndingProperties.js';
import { QuizDetailedScoreboard, QuizScore } from './main/scoreboards/scoreboard.js';
import { QuizEndingPageEditor } from './main/editors/quizEndingEditors.js';
import { DocumentEditor } from './main/editors/documentEditors.js';
import { HttpClient } from './main/httpclient/httpClient.js';
import { ScoreboardTableEditor } from './main/editors/quizEditors.js';
const documentEditor = DocumentEditor.fromDocument(document);
const httpClient = new HttpClient();
const scoreboardTableEditor = new ScoreboardTableEditor(document, QuizEndingProperties.QUIZ_ENDING_SCOREBOARD_TABLE_ID, QuizEndingProperties.QUIZ_ENDING_SCOREBOARD_NUMBER_OF_SCOREBOARD_ROWS);
console.log(sessionStorage.getItem(Properties.QUIZ_NAME_SESSION_STORAGE_KEY));
// const nullableDetailedScoreboardJson: string | null = sessionStorage.getItem(Properties.QUIZ_DETAILED_SCOREBOARD_SESSION_STORAGE_KEY);
// const detailedScoreboardJson: string = Utils.getStringOrThrowError(nullableDetailedScoreboardJson, 'invalid session storage key');
// const detailedScoreboard: QuizDetailedScoreboard = QuizDetailedScoreboard.fromJson(detailedScoreboardJson);
httpClient.getQuizStatistics()
    .then(o => {
    const detailedScoreboard = QuizDetailedScoreboard.fromJson(o);
    const quizEndingPageUpdater = new QuizEndingPageEditor(document, detailedScoreboard);
    quizEndingPageUpdater.loadPage();
});
// const quizEndingPageUpdater: QuizEndingPageEditor = new QuizEndingPageEditor(document, detailedScoreboard);
// quizEndingPageUpdater.loadPage();
// IndexedDBClient.saveScore(detailedScoreboard.getQuizScore());
// httpClient.getTopScores()
// .then(result => mapScoresAndAddRows(result));
mapScoresAndAddRows([2, 1, 3, 4]);
function mapScoresAndAddRows(scores) {
    const mappedAndSortedScores = scores
        .map(o => new QuizScore(o))
        .sort((a, b) => a.compare(b));
    scoreboardTableEditor.addRowsWithScoresInGivenOrder(mappedAndSortedScores, QuizEndingProperties.QUIZ_ENDING_SCOREBOARD_TABLE_CLASS);
}
const returnButton = documentEditor.getElement(QuizEndingProperties.QUIZ_ENDING_RETURN_BUTTON);
returnButton.addEventListener(Properties.CLICK_EVENT_TYPE, returnButtonClickListener);
function returnButtonClickListener() {
    // todo pewnie cos zrobic
    location.href = Properties.QUIZ_HTML_FILE;
}
